# DontPad Code
<img width="1440" alt="Screenshot 2023-01-20 at 19 36 11" src="https://user-images.githubusercontent.com/67306273/213767946-623a9378-3734-4a79-a183-4c20a3cf0d93.png">

DontPad Code is a powerful, feature-rich code editing application built using the Django web framework. Developed by a team of experienced programmers, it offers a seamless and intuitive experience for developers of all skill levels.

## Features

- **Login/Registration**: Users can easily create an account and log in to access the editor.
- **Integrated Development Environment (IDE)**: A full-featured IDE that provides all the tools necessary for writing and editing code.
- **Real-time Chat**: Collaborate with other users in real-time through a built-in chat feature.
- **Admin/User Versions**: Admin users have access to additional versioning tools to manage code changes.
- **In-browser Code Execution**: The ability to run code directly in the browser with the ability to view the output.
- **Themes**: Customize the look and feel of the editor with various color schemes and themes.
- **Code Saving**: Save and retrieve code snippets for later use.
- **File Upload**: Upload code from a file for editing.
- **Code Manipulation**: Copy, cut, paste, undo, and redo code with ease.
- **Syntax Highlighting**: Code is highlighted and color-coded for improved readability.
- **Interactive Comments**: Add comments to code with support for GIFs and emoticons.
- **Screenshot Creation**: Create a screenshot of selected code and share it on WhatsApp.
- **Screen Recording**: Record your screen while coding and save the video for later use.
- **Interactive Videos**: Watch interactive videos and copy, paste, and insert code as the video plays.

With its robust feature set and user-friendly interface, DontPad Code is the perfect choice for developers looking to streamline their coding workflow. The application is open-source and the code can be found on [GitHub](https://github.com/lalalaurentiu/dontpad.git) under the MIT license.

## Getting Started

1. **Prerequisites**: Before you begin, make sure you have the following software installed on your system:
    - [Django](https://www.djangoproject.com/)
    - [Python](https://www.python.org/) (version 3.x)
    - [Docker](https://www.docker.com)
    - A database management system such as [PostgreSQL](https://www.postgresql.org/) or [MySQL](https://www.mysql.com/)

2. **Clone the repository**: To get started, you will need to clone the project repository to your local machine. You can do this by running the following command in your terminal:

	`git clone https://github.com/lalalaurentiu/dontpad.git`

3. **Create a virtual environment**: It is recommended to create a virtual environment in order to isolate the dependencies of the project from other projects on your system. You can use [virtualenv](https://virtualenv.pypa.io/en/latest/) or [conda](https://docs.conda.io/en/latest/) to create a virtual environment.

4. **Install dependencies**: Once you have your virtual environment set up, navigate to the project directory and install the required dependencies by running the following command:

	`pip install -r requirements.txt`

5. **Create a database**: You will need to create a new database for the project. You can use any database management system that is supported by Django.

6. **Migrate the database**: Run the following command to create the necessary tables in the database:

	`python manage.py migrate`
	
7. **Run Docker and Redis**: We will use a channel layer that uses Redis as its backing store. To start a Redis server on port 6379, run the following command:

	`docker run -p 6379:6379 -d redis:5`

8. **Run the development server**: You can now run the development server by running the following command:

	`python manage.py runserver`
	
	The application will be available at `http://localhost:8000/`

9. **Create a superuser**: You can create a superuser by running the following command:

	`python manage.py createsuperuser`

## Usage

The DontPad Code can be used in the following way:

## Contribution

We welcome and encourage contributions to the Aplicația de gestionare a proiectelor. Here are a few ways you can help:

- **Reporting bugs**: If you find a bug, please report it by creating an issue in the GitHub repository.
- **Suggesting enhancements**: If you have an idea for an enhancement, please suggest it by creating an issue in the GitHub repository.
- **Submitting pull requests**: If you are interested in fixing bugs or implementing enhancements, please feel free to submit a pull request. Before submitting, please make sure to read the [Contribution Guidelines](CONTRIBUTING.md).

We appreciate any and all contributions to the Aplicația de gestionare a proiectelor, and we thank you in advance for your help!

## Authors

- Laurentiu Marian

## Credits

- [Django](https://www.djangoproject.com/) - The web framework used.
- [Docker](https://www.docker.com/get-started/) - Containers used in the application.
- [CodeMirror](https://codemirror.net/5/doc/manual.html) - Code editor used in the application.

