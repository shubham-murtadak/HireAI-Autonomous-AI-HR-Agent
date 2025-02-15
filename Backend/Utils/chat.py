import os
from langchain_groq import ChatGroq
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate,MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.chat_history import InMemoryChatMessageHistory


# Load environment variables
load_dotenv()

# API Key for Groq
GROQ_API_KEY = os.getenv('GROQ_API_KEY')


#initialize chat history object


# Initialize the LLM
llm = ChatGroq(
    model="llama-3.1-8b-instant",
    # model="mixtral-8x7b-32768",
    temperature=0.5,
    max_tokens=1000,
    timeout=30,
    max_retries=3,
    api_key=GROQ_API_KEY
)


store={}
#function to manage sessionwise hisotry using inmemorychatmessagehistory
def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = InMemoryChatMessageHistory()

    return store[session_id]


#function to get chat response
def chatbot(question, session_id="abc1234"):
    print(question)
    # print("question received :",question)
    
    # Define the ChatPromptTemplate
    prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            (
                """
                You are HireAI, an AI-powered HR assistant, designed to provide concise, relevant, and user-friendly answers about hiring and recruitment processes. You specialize in assisting users with the following features:\n

                **Capabilities:**  \n
                - **Email Monitoring:** Provide insights on job application submissions, interview scheduling, and follow-ups based on email queries.  \n
                - **Resume Parsing:** Extract and summarize skills, experience, education, and contact details from resumes.  \n
                - **Candidate Ranking:** Explain how candidates are ranked based on skills, experience, and job description suitability.  \n
                - **AI-Powered Interviews:** Describe how AI conducts interviews, analyzes responses, and evaluates candidates.  \n
                - **Interview Scheduling:** Assist with scheduling interviews by integrating with calendars.  \n
                - **Sentiment & Context Analysis:** Explain how candidate responses are dynamically assessed during interviews.  \n

                **Guidelines:**  \n
                - Provide short, direct, and precise answers (max 5 lines). Introduce yourself in first response \n
                - Use simple, professional language to ensure clarity and engagement.  \n
                - For queries outside these features, respond with: \n 
                  *"I can assist only with the features of RecruitAI for hiring and recruitment."*  \n
                """
            ),
        ),
        MessagesPlaceholder(variable_name="chat_history"),
        (
            "human",
            "{input}"
        ),
    ]
)


    #create chain of responses
    chain = (
        prompt
        | llm
    )

    #add history in chain 
    chain_with_message_history = RunnableWithMessageHistory(
        chain,
        get_session_history,
        input_messages_key="input",
        history_messages_key="chat_history",
    )

    # invoke the chain
    response = chain_with_message_history.invoke(
        {"input": question},
        config={"configurable": {"session_id": session_id}},
    )

    return response.content


if __name__=='__main__':
   while(True):
    question=input("Enter your question:")
    if question=='break':
        break

    ans=chatbot(question)
