import os
import asyncio
from flask import Flask, request, jsonify
from integry import Integry
from langchain_openai import ChatOpenAI
from langchain_core.tools import StructuredTool
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import SystemMessage, HumanMessage
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)

async def runAgent(user_id, message, integry, llm):

    response = await integry.functions.predict(
        prompt=message,
        user_id=user_id,
        predict_arguments=True,
    )

    print(response)

    if not response or not response[0]:
        return {
            'messages': "Can't find the appropriate response, please try again",
            'detailsResponse': 'Unable to validate the query'
        }


    agent_message = await integry.functions.get(response[0].name, user_id)
    tool = agent_message.get_langchain_tool(StructuredTool.from_function, user_id)

    agent = create_react_agent(
        tools=[tool],
        model=llm,
    )

    agentResponse = await agent.ainvoke(
    {
        "messages": [
            SystemMessage(content="You are a helpful assistant"),
            HumanMessage(content=message),
        ]
    })

    return {
        'messages': agentResponse["messages"][-1].content, 
        'detailsResponse': {
            "messages": [msg.content for msg in agentResponse["messages"]],
            "other_data": {key: value for key, value in agentResponse.items() if key != "messages"}
        }
    }


@app.route('/')
def home():
    return "Hello, World!"

@app.route("/get-details", methods=["POST"])
def details():
    data = request.get_json()

    user_id = data.get("userId")
    appKey = data.get("appKey")
    apiKey = data.get("apiKey")
    message = data.get("message")

    if not user_id or not appKey or not apiKey or not message:
        return jsonify({"error": "All fields are required"}), 400

    integry = Integry(app_key=appKey, app_secret=apiKey)

    llm = ChatOpenAI(
        model="gpt-4o",
        api_key=os.environ.get("OPENAI_API_KEY"),
    )

    agentResponse = asyncio.run(
        runAgent(user_id, message, integry, llm),
    )

    return agentResponse

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
