import os
import urllib.parse
from dotenv import load_dotenv
from pymongo.server_api import ServerApi
from pymongo.mongo_client import MongoClient

load_dotenv()

USERNAME=os.getenv("MONGODB_USERNAME")
PASSWORD=os.getenv("MONGODB_PASSWORD")


# Escape the username and password
escaped_username = urllib.parse.quote_plus(USERNAME)
escaped_password = urllib.parse.quote_plus(PASSWORD)

# Build the URI
uri = f"mongodb+srv://{escaped_username}:{escaped_password}@cluster0.vjicf.mongodb.net/?retryWrites=true&w=majority&tlsAllowInvalidCertificates=true"

# MongoDB Client
client = MongoClient(uri, server_api=ServerApi('1'), serverSelectionTimeoutMS=30000)

# Define Database and Collections
db = client["Hireai"]

# Collections
jobs_collection = db["jobs"]
applications_collection = db["applications"]

print("Database and collections are ready!")
