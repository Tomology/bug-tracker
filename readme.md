# Cimex: Bug Tracker

Cimex is a project management application built using the MERN stack. Features include:

- User registration and authentication.
- User search.
- A 'friend request' system.
- Project sharing.
- Ability to invite users to join a team.
- Ability to assign issues to users / teams.
- Ability to create, edit/update, and delete:
  - projects
  - issues
  - teams
  - profile

## Installation

**1. Clone _'bugtracker'_ Repository**</br></br>
HTML:

```
git clone https://github.com/Tomology/bugtracker.git
```

SSH:

```
git clone git@github.com:Tomology/bugtracker.git
```

GitHub CLI:

```
gh repo clone Tomology/bugtracker
```

**2. Install dependencies**</br></br>
Change directory into the _bugtracker_ folder where _package.json_ is located.

```
cd bugtracker
```

Install dependencies:

```
npm install
```

Next change directories into the _client_ folder.

```
cd client
```

Install the client-side dependencies:

```
npm install
```

**3. Setup JSON Web Token secret key and connect to MongoDB**</br></br>
Create a new file called _default.json_ in the _config_ folder. Create the following JSON object:

```
{
  "mongoURI": "your_mongo_URI_goes_here",
  "jwtSecret": "you_JSON_Web_Token_secret_key_goes_here"
}
```

You will need to create a new cluster in mongoDB. Once set up, copy the mongoURI and assign it to the _"mongoURI"_ key.</br>
Generate or make up your own JSON Web Token secret key and assing it to the _"jwtSecret"_ key.
</br>
**Note:** for production you will need to create another file called _production.json_ in the _config_ folder and copy the contents of _defualt.json_ into it.
</br></br>

**4. Run server**</br></br>
Change back into the root directory and run the server:

```
npm run dev
```
