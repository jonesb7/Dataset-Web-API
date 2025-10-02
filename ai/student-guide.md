# Using AI Assistants with TCSS-460 HelloWorld API

## Student Guide to AI-Assisted Learning

This guide helps you use AI assistants (like Claude, ChatGPT, GitHub Copilot, etc.) effectively while working on TCSS-460 course projects.

---

## 🎯 Learning Goals First

**Remember:** The goal is to **learn**, not just to complete assignments. AI is a tool to help you understand concepts, not to do the work for you.

### Good Uses of AI
✅ **Explaining concepts** - "What does idempotency mean in HTTP?"
✅ **Understanding code** - "Can you explain what this middleware does?"
✅ **Debugging help** - "Why am I getting this TypeScript error?"
✅ **Learning patterns** - "What's the difference between PUT and PATCH?"
✅ **Clarifying documentation** - "What does this Express.js pattern mean?"
✅ **Best practices** - "What's the proper way to handle async errors?"

### Avoid These Pitfalls
❌ **Copy-paste without understanding** - You'll struggle on exams and future projects
❌ **Having AI write entire features** - You're cheating yourself of learning
❌ **Skipping the documentation** - Read the docs first, then ask AI for clarification
❌ **Not testing AI suggestions** - AI can be wrong; always verify and test
❌ **Depending on AI for basic concepts** - Build your foundational knowledge first

---

## 🚀 Quick Start: Bootstrap Your AI Assistant

**Before you start working with AI, give it context about this project!**

### Use the AI Context File

This project includes `ai/ai-context.md` - a bootstrap file that teaches any AI assistant about the project structure, conventions, and learning goals.

**How to use it:**

1. Open `ai/ai-context.md` in this repository
2. Copy the entire "AI Bootstrap Prompt" section (between the `---` markers)
3. Start a new conversation with your AI assistant (Claude, ChatGPT, etc.)
4. Paste the bootstrap prompt as your first message
5. The AI now understands your project! Ask your questions.

**Why this helps:**
- ✅ AI knows the project structure and conventions
- ✅ AI understands the educational goals
- ✅ AI will teach rather than just solve
- ✅ AI references the right files and patterns
- ✅ AI follows Professor Bryan's coding standards

**Example workflow:**
```
1. Open ai/ai-context.md
2. Copy the bootstrap prompt
3. Open ChatGPT/Claude
4. Paste bootstrap prompt
5. AI: "I understand your project..."
6. You: "Now help me understand middleware order in Express"
7. AI: [Gives contextual answer specific to your project]
```

**Do this once at the start of each AI session for best results!**

---

## 📚 How to Use This Project with AI

### Step 1: Start with Documentation

Before asking AI anything, **read the relevant documentation**:

1. **Project README** (`/README.md`) - Start here for overview
2. **HTTP Fundamentals** (`/docs/http-fundamentals.md`) - Core concepts
3. **Node/Express Architecture** (`/docs/node-express-architecture.md`) - How it's structured
4. **API Documentation** (`/docs/API_DOCUMENTATION.md`) - Endpoint reference

### Step 2: Explore the Code

Use AI to help you **understand** what you're reading:

**Example Conversation:**
```
You: I'm looking at src/app.ts. Can you explain the middleware stack?

AI: [Explains middleware ordering and why each piece matters]

You: Why does the error handler need to be last?

AI: [Explains Express middleware execution order]

You: Can you show me an example of what happens if I put it first?

AI: [Demonstrates the problem with code example]
```

### Step 3: Experiment and Learn

Use AI to help you **experiment safely**:

**Example Workflow:**
```
You: I want to add a new endpoint that returns user data. Can you outline
     the steps I need to take in this project structure?

AI: [Provides outline: controller → routes → types → testing]

You: Let me try writing the controller first. [You write code]

You: I wrote this controller [paste code]. Can you review it for issues?

AI: [Points out potential bugs, suggests improvements]

You: Why is it better to use asyncHandler here?

AI: [Explains async error handling pattern]
```

---

## 🤔 How to Ask Good Questions

### Be Specific About Your Context

**Bad Question:**
```
"My code doesn't work. Help?"
```

**Good Question:**
```
"I'm working on the TCSS-460 HelloWorld API project. I added a new endpoint
in src/controllers/userController.ts that should return user data, but I'm
getting a TypeScript error: 'Property 'name' does not exist on type 'Request'.
Here's my code: [paste code]. What am I doing wrong?"
```

### Provide Relevant Information

When asking for help, include:
- What you're trying to accomplish
- What you've already tried
- Error messages (full text)
- Relevant code snippets
- Which file you're working in
- What documentation you've already read

### Ask "Why" Not Just "How"

**Surface Learning:**
```
You: How do I fix this error?
AI: Change line 5 to this: [code]
You: Thanks! [copies code without understanding]
```

**Deep Learning:**
```
You: I'm getting this error. Why is this happening?
AI: [Explains the underlying concept]
You: So if I understand correctly, [your explanation]. Is that right?
AI: [Confirms or clarifies]
You: Given that, should I [approach 1] or [approach 2]?
AI: [Explains trade-offs]
You: I'll try approach 1. [You write the code yourself]
```

---

## 🔧 Practical AI Use Cases for This Project

### Understanding HTTP Methods

**Scenario:** You need to decide whether to use PUT or PATCH for an update endpoint.

```
You: In the TCSS-460 project, I see examples of both PUT and PATCH in
     src/controllers/helloController.ts. When should I use each one?

AI: [Explains PUT (full replacement) vs PATCH (partial update)]

You: So if I'm updating just a user's email address, PATCH makes more sense?

AI: [Confirms and explains why]

You: What would the request body look like for each approach?

AI: [Shows examples of both]
```

### Debugging TypeScript Errors

**Scenario:** You're getting a TypeScript compilation error.

```
You: I'm getting this TypeScript error in my controller:
     "Type 'string | undefined' is not assignable to type 'string'"

     Here's my code:
     const name = request.query.name;

     This project has strict TypeScript enabled. How should I handle this?

AI: [Explains TypeScript strict null checks and query parameter types]

You: I see the project uses validationUtils.ts. Should I use that?

AI: [Explains the sanitizeString utility and why it's there]

You: [You implement the fix using the project's patterns]
```

### Learning Project Patterns

**Scenario:** You need to add a new feature following project conventions.

```
You: I need to add a new endpoint that handles user registration. Looking at
     the existing code in this project, what patterns should I follow?

AI: [Outlines the project's MVC pattern, path aliases, error handling, etc.]

You: I see the project uses asyncHandler. Can you explain what it does?

AI: [Explains async error handling wrapper]

You: So I should structure my controller like this: [your code]. Is that right?

AI: [Reviews your code against project conventions]
```

---

## 🎓 Academic Integrity Guidelines

### What's Allowed

✅ **Ask AI to explain concepts** from lectures or readings
✅ **Request clarification** on assignment requirements (then verify with professor)
✅ **Debug errors** by asking AI to explain what's wrong
✅ **Learn patterns** by asking about best practices
✅ **Understand existing code** in the template
✅ **Review your own code** for potential improvements

### What's NOT Allowed

❌ **Having AI write entire assignment solutions**
❌ **Copying AI-generated code without understanding it**
❌ **Submitting AI-written code as your own work**
❌ **Using AI to bypass learning objectives**
❌ **Sharing AI-generated solutions with classmates**

### The Golden Rule

**If you can't explain what your code does and why you wrote it that way, you shouldn't submit it.**

---

## 💡 Effective Learning Strategies

### 1. The "Explain It Back" Method

After AI explains something:
```
AI: [Explains concept]
You: Let me make sure I understand. [Explain it in your own words]
AI: [Confirms or corrects your understanding]
```

### 2. The "Why This Way?" Method

Always ask why the suggested approach is best:
```
You: Why do we use path aliases instead of relative imports?
You: Why is middleware order important?
You: Why do we need asyncHandler?
You: Why does this project prefer 'request' over 'req'?
```

### 3. The "Implement It Yourself" Method

```
You: [Ask AI to explain the pattern]
AI: [Explains]
You: [Close the AI chat]
You: [Write the code yourself from memory]
You: [Go back to AI only if stuck]
```

### 4. The "Code Review" Method

Write code first, then get feedback:
```
You: [Write your implementation]
You: I implemented this feature. Can you review it for issues?
AI: [Points out problems]
You: [Fix issues and understand WHY they were problems]
```

---

## 🚀 Example Learning Session

Here's a complete example of effective AI-assisted learning:

### Goal: Add a new endpoint that validates and sanitizes user input

**Phase 1: Understanding**
```
You: I need to add an endpoint that accepts user input. I've read
     docs/http-fundamentals.md and looked at parametersController.ts.
     Can you explain why input validation is important?

AI: [Explains security risks, data integrity, etc.]

You: This project has validationUtils.ts. What does sanitizeString do?

AI: [Explains the sanitization process]
```

**Phase 2: Planning**
```
You: Based on the project structure, I think I need to:
     1. Create a controller in src/controllers/
     2. Add routes in src/routes/open/
     3. Define types in src/types/
     Is that the right approach?

AI: [Confirms or suggests adjustments]

You: Should I use query parameters or body parameters for user data?

AI: [Explains trade-offs based on HTTP methods]
```

**Phase 3: Implementation (You Do This Part!)**
```
You: [Close AI and write the code yourself]
You: [Reference existing code in the project as examples]
You: [Test your implementation]
```

**Phase 4: Review**
```
You: I implemented the feature. Here's my code: [paste]
     Can you identify any issues or suggest improvements?

AI: [Reviews code]

You: Why is [specific suggestion] better?

AI: [Explains reasoning]

You: [Make improvements with understanding]
```

---

## 🧪 Testing Your Understanding

### Quiz Yourself

After using AI to learn something, test yourself:

1. **Close the AI chat**
2. **Write the concept in your own words** (no looking!)
3. **Implement the pattern from memory**
4. **Only then** compare with AI's explanation

### Explain to Others

Best way to verify you understand:
- Explain it to a classmate
- Write it in your own notes
- Create a simple example from scratch

### Can You Answer These Without AI?

If you've been using AI effectively, you should be able to answer:
- What's the difference between GET and POST?
- Why do we need middleware in Express?
- What does TypeScript strict mode do?
- How does async/await work in JavaScript?
- What's the purpose of HTTP status codes?

---

## 📖 Recommended Workflow

### Before Every Coding Session

1. **Read the relevant docs first** (`/docs/` directory)
2. **Look at existing examples** in the codebase
3. **Try to implement yourself** before asking AI

### When You're Stuck

1. **Check the error message carefully** - Read it fully
2. **Search the project docs** - Might be explained there
3. **Look at similar code** in the project
4. **Then ask AI** with specific context

### After AI Helps You

1. **Make sure you understand** - Explain it back
2. **Implement it yourself** - Don't just copy
3. **Test your code** - Make sure it works
4. **Ask "why"** - Understand the reasoning

---

## 🎯 Project-Specific Tips

### Understanding This Project's Structure

Use AI to help you understand the architecture:

```
You: Can you explain the folder structure in src/? Why is middleware
     separated from controllers?

You: What's the purpose of the barrel exports (index.ts files)?

You: Why does this project use path aliases like @/ and @middleware/*?

You: I see asyncHandler used everywhere. Can you trace through what
     happens when an error is thrown?
```

### Working with TypeScript

```
You: The project has strict: true in tsconfig.json. What does this mean
     for my code?

You: I'm getting "possibly undefined" errors. How should I handle this
     in this project's pattern?

You: What's the difference between interface and type in TypeScript?
     When does this project use each?
```

### Following Project Conventions

```
You: I notice the project uses 'request' instead of 'req'. Why is this
     important for learning?

You: How should I structure my JSDoc comments like the rest of the project?

You: What's the standard response format used in this project?
```

---

## 🆘 When to Ask the Professor Instead

Some questions are better for Professor Bryan:

- **Assignment requirements** - "Is this what you want us to do?"
- **Grading criteria** - "Will this approach be acceptable?"
- **Course concepts** - "Can you explain how this relates to lecture?"
- **Academic integrity** - "Is it okay if I...?"
- **Technical setup** - "My environment isn't working"

Don't rely on AI for course-specific guidance. Always verify important decisions with your professor.

---

## 📝 Document Your Learning

### Keep a Learning Log

After each AI session, write down:
- What you learned
- Key concepts explained
- Code patterns you now understand
- Questions you still have

### Example Log Entry

```
Date: 2025-10-02
Topic: Error handling in Express

What I learned:
- asyncHandler wrapper catches errors in async functions
- Error middleware must be last in the stack
- AppError class lets us create custom HTTP errors
- Environment affects how much error detail is shown

Code I wrote:
- Created new controller using asyncHandler
- Added error handling for invalid input

Questions remaining:
- How do operational vs programming errors differ?
- When should I create custom error classes?
```

---

## 🎓 Remember

**AI is a teaching assistant, not a substitute for learning.**

The best developers:
- Understand their code deeply
- Can explain their decisions
- Learn from mistakes
- Build on fundamentals
- Think critically about solutions

Use AI to accelerate your learning, not replace it. The skills you build now will serve you throughout your career.

**When in doubt, ask yourself:** "Can I explain this to someone else without looking at the AI's explanation?"

If the answer is no, keep learning until you can.

---

## 🔗 Additional Resources

### Project Documentation
- `/README.md` - Complete project overview
- `/docs/` - 15 educational guides
- `/docs/API_DOCUMENTATION.md` - API reference

### External Resources
- [MDN Web Docs](https://developer.mozilla.org/) - HTTP, JavaScript, Web APIs
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Official TypeScript docs
- [Express.js Guide](https://expressjs.com/en/guide/routing.html) - Official Express docs

### Getting Help
- **Office Hours** - Best place for course-specific questions
- **Canvas Discussions** - Learn from classmates
- **Professor Bryan** - cfb3@uw.edu

---

**Good luck, and remember: The goal is to learn, not just to complete assignments!** 🚀
