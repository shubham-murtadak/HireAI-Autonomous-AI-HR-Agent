FROM python:3.11.9

# Set the working directory inside the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install the required Python packages
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install pymupdf


# Expose the port the app runs on
EXPOSE 8501

# Command to run Streamlit app
CMD ["streamlit", "run", "app_docker.py"]
