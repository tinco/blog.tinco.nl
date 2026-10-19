=========



=========


The first question is a tricky one. If Ruby is already an over specification of the system requirements, then logically it follows that the Rust implementation is an even larger over specification of the system. If we translate our Ruby system to Rust, will we make it harder for our agents to modify our codebase in the future because it is harder to distinguish business requirement from implementation detail?

The second question is the big one. If the original Ruby code is an over specification, and the natural language prompt is an under specification, then what would an optimal specification look like? Whatever the answer to this question is will be the answer to what the future of programming is. It’s going to be a new language, one that allows humans and agents to reason precisely and efficiently over how to make computers do valuable work.

There’s already been many approaches to this of course. When OpenAI published the harness engineering post there was already a bevy of choices, most being various forms of markdown file structures, the most popular one by my knowledge being OpenSpec. However those kinds of harnesses are still mostly natural language descriptions whose interpretation is loosely interpreted by the agents and although it’s a tighter specification than an unstructured prompt, it’s far from being as precise a description of the business requirements that a Ruby codebase would be. That problem is made more difficult by the fact that agentic interpretation is a moving target. How much you can and must tell an agent before they can reliably implement software that meets a requirement has changed dramatically in the past couple years and even more so in the past 6 months.

While visiting customers I’ve seen many engineering teams develop shared harnesses, these days also often called software factories. On top of that there’s also many companies supplying software factories as a subscription product and many of the large software consultancies have also pivoted to developing software factories to back their consultants. 

[natural language prompt] -<improves>-> [specification] -<agentic coding>-> [implementation]

So far, the most common complaint about these harnesses is that they either contain mountains of markdown slop that are nearly as impossible to work trudge through and contain as much truth as misinformation about the actual system. When they don’t it’s because they’re more a set of instructions and hints on how to work in the codebase rather than specifying its requirements.

It’s a brand new dawn for programming language designers to figure out what this future is going to look like.
