---
layout: post
title: The future of programming
summary: 
---

The idea that expressing logic in programming languages would eventually no longer be part of our daily jobs has put a melancholic twist on what is the most exciting development in software since probably the internet. The feeling of melancholy has recently started to twist into a feeling of anticipation for the next great development in the way humans tell computers what to do. If just prompting Claude Code to do things leads to repetitive under specification of the problem you’re trying to solve and typing out the full solution in an expressive language like Ruby or Rust is now considered to be tedious over specification, then what’s the right level of abstraction? The answer to that question is going to shape the future of programming.

About two years ago LLM’s started to become good at generating and transforming code which was a huge bummer for people like me who love dabbling with and creating niche programming languages. The secret hope of creating the perfect programming language for humans to talk to computers with was dashed by the idea that humans would simply be prompting agents to do the actual writing. Two years later DHH  came to this realisation too and argued for automated porting of features from Ruby to Rust to accomplish hardware cost savings at the 2026 Rails World Conference to the effect of much commotion within the Ruby community.

At my day job we help organisations migrate from legacy platforms with difficult or non-existent upgrade paths like Perl, Delphi, 4GL and Cobol to modern versions of Java, C# or indeed Rust. Engineers at these organisations have spent decades refining their code to best satisfy the needs of their customers and their managers. This code that is spread over different systems and various environments is an expression of the mapping of those business requirements to the hardware and integration constraints. Our task is pulling apart the requirements, the constraints and reapply them to a new platform and then verifying the transformed code behaves identical to the original code.

At the start of the year OpenAI published an influential article on a new way of working they had been successful with for a green field project and that had been gaining traction at various enterprises in the preceding months. They call this practice “harness engineering” but it’s also known as spec driven development. When following this process instead of typing a prompt directly to the agent, you spend time refining a specification of the work the agent should do before sending it out. Typically this specification stays present in your repository to serve as a reference for agents to base their decisions on for future features and modifications.

Now we’ve identified three major methods of agentic coding processes:

[natural language prompt] -<agentic coding>-> [code]
Vibe coding.

[specification] -<agentic coding>-> [code]
Harness engineering.

[original code] -(agentic analysis)-> [requirements specification] -(agentic coding)-> [rust code]
Automated recoding.

Ordered from being at risk of under specification to being at risk of over specification. When transforming existing code to a new language, you are dealing with over specification. The original Ruby code does not only specify the business rules, it also specifies the architecture, the technologies and libraries to use, the algorithms and all sorts of implementation details that might or might not be relevant to the final Rust implementation.

On the vibe coding side, there is under specification. Not only does the natural language prompt probably not include literally all business rules, acceptance criteria, performance requirements, maintenance concerns and user preferences, it usually leaves the agentic coding system to decide the architecture, the technologies and libraries, the algorithms and all the other implementation details that might or might not affect the quality of the final Rust implementation.

In the harness engineering process there’s risk of both under specification and over specification. Not long after OpenAI published their article and the accompanying project, critics remarked that the claims of the project being fully autonomously coded were overwrought as explicit algorithms and architectural decisions were embedded in the specification.

If a single interaction pattern is going to be the future of programming, then that interaction pattern must have the following properties:

1. It should consistently result in functionally correct code that meets secondary requirements like performance, resource usage and usability.
2. It should accomplish the above two functionalities at an abstraction level that is as close as possible to the expression of business requirements in natural language.
3. It should allow the operator to modify the code without requiring knowledge of implementation details such as implementation language, architecture or algorithms.

Property 1 is what we ask of every computer programming platform. Whatever language or system we’re building it should allow us to meet our primary objectives predictably.  Property 2 is the traditional requirement we put on ease of use oriented programming languages. Property 3 is the property that evolves in every jump in level of abstraction. The first time the operator was relieved of having to do binary translation in their head. Then later the operator no longer needed to know the specific processor instructions, and so on. In this iteration of the property, the ambition is that the agentic process allows us to fully decouple business requirements from platform specific detail.

So. We’re actually just on the cusp of a new programming language paradigm, however one with an interesting twist. Like when we went from punch cards to keyboards and monitors, there is also a revolution in the way we operate interface with our programming environment. The programming languages of the future are not only going to be steering agents into writing code, they themselves are going to be generated and modified by agents. No modern software developer is going to sit around and learn a new programming language, let alone use it to type out business requirements. Agents are going to be writing this new programming language, and we are going to be communicating with them to ensure those business requirements get encoded correctly.

To make sure the final code is consistently correct, the language must help prevent under specification. However to allow its work to be easily inspected and iterated upon without exposing implementation detail it should be minimally over specified. And then finally it should be easy for an agent to translate this language consistently to and from natural language as part of its interaction model with the operator. This is the challenge for the programming language designers of the future, and I’m excited to find out what we’re going to be coming up with.

=========



=========


The first question is a tricky one. If Ruby is already an over specification of the system requirements, then logically it follows that the Rust implementation is an even larger over specification of the system. If we translate our Ruby system to Rust, will we make it harder for our agents to modify our codebase in the future because it is harder to distinguish business requirement from implementation detail?

The second question is the big one. If the original Ruby code is an over specification, and the natural language prompt is an under specification, then what would an optimal specification look like? Whatever the answer to this question is will be the answer to what the future of programming is. It’s going to be a new language, one that allows humans and agents to reason precisely and efficiently over how to make computers do valuable work.

There’s already been many approaches to this of course. When OpenAI published the harness engineering post there was already a bevy of choices, most being various forms of markdown file structures, the most popular one by my knowledge being OpenSpec. However those kinds of harnesses are still mostly natural language descriptions whose interpretation is loosely interpreted by the agents and although it’s a tighter specification than an unstructured prompt, it’s far from being as precise a description of the business requirements that a Ruby codebase would be. That problem is made more difficult by the fact that agentic interpretation is a moving target. How much you can and must tell an agent before they can reliably implement software that meets a requirement has changed dramatically in the past couple years and even more so in the past 6 months.

While visiting customers I’ve seen many engineering teams develop shared harnesses, these days also often called software factories. On top of that there’s also many companies supplying software factories as a subscription product and many of the large software consultancies have also pivoted to developing software factories to back their consultants. 

[natural language prompt] -<improves>-> [specification] -<agentic coding>-> [implementation]

So far, the most common complaint about these harnesses is that they either contain mountains of markdown slop that are nearly as impossible to work trudge through and contain as much truth as misinformation about the actual system. When they don’t it’s because they’re more a set of instructions and hints on how to work in the codebase rather than specifying its requirements.

It’s a brand new dawn for programming language designers to figure out what this future is going to look like.
