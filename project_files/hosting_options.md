# Hosting Options

## Option 1: Heroku
- Pros: Free tier, simple Node.js deployment, built-in Postgres add-on.
- Cons: Free tier is limited, scaling costs money.

## Option 2: Render
- Pros: Easy GitHub integration, free Postgres instance, modern interface.
- Cons: Free tier sleeps after inactivity.

## Option 3: AWS EC2 + RDS
- Pros: Full control, scalable, production-grade.
- Cons: More setup complexity, not free long-term.

## Chosen Option
For this project, Render (or Heroku) is a good balance between ease of use and cost.  
We can push code directly from GitHub, and a Postgres instance can be provisioned with minimal setup.
