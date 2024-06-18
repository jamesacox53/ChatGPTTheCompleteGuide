from langchain.agents import load_tools, initialize_agent, AgentType
from langchain.llms import OpenAI

llm = OpenAI(openai_api_key='your_api_key', temperature=0.0)
tools = load_tools(['wikipedia', 'llm-math'], llm=llm)

agent = initialize_agent(tools, llm, 
agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True)

prompt = input('The Wikipedia research task: ')

agent.run(prompt)