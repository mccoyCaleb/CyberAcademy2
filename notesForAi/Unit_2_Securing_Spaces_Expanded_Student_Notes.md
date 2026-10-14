# Unit 2 — Securing Spaces
## Expanded Student Notes

> **Big idea:** Cybersecurity is not only about protecting software and networks. A secure environment also depends on people, physical spaces, devices, policies, and the ability to detect and respond to attacks.

---

# How to Use These Notes

These notes are designed to help you do more than memorize vocabulary. For AP-style questions, you should be able to **recognize a concept in a scenario, explain why it applies, and connect it to a security decision**.

As you study each section, try to answer four questions:

1. **What is the concept?**
2. **Why does it matter?**
3. **What would it look like in a real situation?**
4. **How would I recognize it in a question?**

A strong cybersecurity student does not just memorize that a vulnerability is a weakness. They can look at a scenario, identify the weakness, identify the threat, determine what asset is affected, and explain what control would reduce the risk.

---

# What Is This Unit About?

Cybersecurity is sometimes imagined as a purely technical subject involving computers, code, networks, firewalls, and encryption. Those things are important, but they are only part of the picture.

A system can have strong passwords, encryption, and firewalls and still be vulnerable if an attacker can physically reach the equipment, persuade an employee to provide information, or enter a restricted area.

Unit 2 focuses on the relationship between **people, physical environments, technology, threats, vulnerabilities, and risk**.

You will learn how to:

- identify threats and vulnerabilities
- identify different types of adversaries
- understand the phases of a cyberattack
- assess cybersecurity risk
- decide how an organization should manage risk
- identify different types and functions of security controls
- use defense in depth
- recognize physical attacks
- protect physical spaces
- detect physical security breaches

### The central idea

> **Physical security is part of cybersecurity.**

Physical access can become a cybersecurity problem because a person with direct access to a device or restricted area may be able to bypass, weaken, or interfere with technical controls.

### Student takeaway

When you see a cybersecurity problem, do not immediately think only about software. Ask:

> **Who has access? Where is the asset? What could happen physically?**

That mindset is important throughout this entire unit.

---

# 2.1 — Cyber Foundations

## Social Engineering

**Social engineering** is the use of psychological or social techniques to manipulate a person into taking an action that benefits an adversary.

Instead of directly breaking into a computer, the attacker may convince a person to do something for them.

For example, an attacker might convince someone to:

- open a malicious file
- click a link
- reveal a password
- provide personal information
- approve a login request
- let someone into a restricted area
- transfer money
- download software
- ignore a security warning

### Why does social engineering work?

Humans naturally rely on shortcuts when making decisions. We often trust people who seem familiar, respect people who appear to have authority, and respond quickly when we feel pressure.

Attackers exploit these normal behaviors.

That means social engineering is often less about advanced computer skills and more about understanding **human behavior**.

### Important idea

> **The attacker may not need to defeat the technology if they can convince a person to defeat the security for them.**

---

## Social Engineering Tactics

The AP framework identifies several psychological tactics that adversaries can use.

### Pretexting

**Pretexting** occurs when an attacker creates a believable story or reason for making a request.

The attacker invents a **pretext** that makes the interaction sound legitimate.

**Example:**

> An attacker contacts an employee and claims to work in IT. They say there is a problem with the employee's account and ask the employee to provide information so the account can be “fixed.”

The important part is the story. The attacker is giving the target a reason to trust the request.

### How to recognize it

Look for language such as:

- “I'm calling because…”
- “There was a problem with your account…”
- “I need this information to fix something…”
- “I'm from another department…”

### Student reminder

**Pretexting = a believable story.**

---

### Authority

**Authority** occurs when an attacker pretends to be someone who has power, status, expertise, or influence over the target.

**Examples:**

> “Your principal needs you to send this information.”

> “The IT administrator told me to collect these credentials.”

> “Your manager asked me to get this file from you.”

People often follow instructions more quickly when they believe the request comes from someone important.

### How to recognize it

Look for references to:

- a boss
- a teacher
- an administrator
- a police officer
- an IT employee
- another person with perceived authority

### Student reminder

**Authority = pressure created by status or power.**

---

### Intimidation

**Intimidation** uses fear or threats of negative consequences.

**Example:**

> “If you don't complete this form immediately, your account will be suspended.”

The attacker wants the target to become worried enough that they stop evaluating whether the request is legitimate.

### Why it works

Fear can make people focus on avoiding the consequence rather than checking the claim.

### Student reminder

**Intimidation = fear of what will happen if you do not comply.**

---

### Consensus

**Consensus** creates social pressure by making a person believe that others have already done something or agree with something.

**Example:**

> “Everyone else in your class has already completed this form. You're the only person who hasn't.”

The attacker is trying to make the target think:

> “If everyone else is doing it, I probably should too.”

### Student reminder

**Consensus = pressure from the group.**

---

### Scarcity

**Scarcity** makes something seem limited or available only briefly.

**Example:**

> “You have five minutes to claim your reward.”

The attacker wants the target to believe that waiting means losing the opportunity.

### Common warning signs

- “Only 2 spots left.”
- “Last chance.”
- “Offer expires today.”
- “You must act before the timer ends.”

A legitimate service can use deadlines too, so a deadline by itself does not prove an attack. The important question is whether the deadline is being used to pressure the target into skipping normal security checks.

### Student reminder

**Scarcity = limited opportunity.**

---

### Familiarity

**Familiarity** occurs when an attacker pretends to be, know, or have a relationship with someone the target already trusts.

**Example:**

> An attacker pretends to be a student's friend and asks for a file or password.

The attacker may also imitate the communication style of someone familiar.

### Student reminder

**Familiarity = trust based on something or someone known.**

---

### Urgency

**Urgency** creates pressure to act immediately.

**Example:**

> “Your account will be deleted in 10 minutes unless you verify it.”

Urgency is especially powerful when combined with another tactic.

For example:

> **Authority + Urgency:** “I am from IT, and your account will be locked in five minutes.”

### Student reminder

**Urgency = pressure to act quickly.**

---

## Social Engineering Tactics — Quick Reference

| Tactic | What the attacker uses | What the target may feel |
|---|---|---|
| **Pretexting** | A believable story | Trust/confidence |
| **Authority** | Status or power | Obligation |
| **Intimidation** | Threats or consequences | Fear |
| **Consensus** | What others supposedly do | Social pressure |
| **Scarcity** | Limited availability | Fear of missing out |
| **Familiarity** | A trusted person or relationship | Comfort/trust |
| **Urgency** | A deadline | Pressure/panic |

### AP-style recognition strategy

When a scenario involves social engineering, ask:

> **What emotion or social behavior is the attacker trying to use against the target?**

Do not just look for the phrase “social engineering.” Look for the behavior underneath it.

---

## Common Social Engineering Attacks You Should Know

The specific psychological tactics above describe **why** a person may be manipulated. Other terms describe **how the attack is delivered**.

### Phishing

**Phishing** is a social engineering attack that attempts to trick someone through a message, often an email, into taking an unsafe action.

Possible goals include getting a target to:

- click a malicious link
- open an attachment
- provide credentials
- reveal financial information
- install malware

### Spear phishing

**Spear phishing** is phishing targeted at a specific person or organization rather than sent broadly.

The attacker may use information about the target to make the message more believable.

### Whaling

**Whaling** is a form of targeted phishing aimed at a high-value individual, such as an executive or other senior decision-maker.

The goal is often to exploit the person's authority, access, or ability to approve important actions.

### Vishing

**Vishing** is voice-based phishing, usually over a phone call or voice communication.

### Smishing

**Smishing** is phishing delivered through text messaging or similar mobile messaging.

### Baiting

**Baiting** uses something attractive or tempting to encourage unsafe behavior.

For example, a target might be tempted by a “free” file, reward, or device and interact with something they should not trust.

### Quid pro quo

**Quid pro quo** social engineering offers something in exchange for the target's action.

For example, an attacker may claim to provide technical help in exchange for information.

### Tailored social engineering

Many real attacks combine multiple tactics. A message could use **authority + urgency + familiarity** at the same time.

That is why memorizing isolated definitions is not enough. You should be able to identify the combination of tactics being used.

---

# Types of Cyber Adversaries

Not all adversaries have the same skills, goals, resources, or motivations.

Knowing **who the adversary is** can help you understand what they may attempt and what kinds of defenses may be necessary.

## Script Kiddies

**Script kiddies** are relatively low-skilled adversaries who use tools created by others without necessarily understanding how those tools work internally.

They may be motivated by:

- curiosity
- recognition
- entertainment
- greed
- wanting to demonstrate their abilities

### Key idea

An attacker does not need advanced technical knowledge to cause damage.

---

## Hacktivists

**Hacktivists** are motivated by social, political, ideological, or personal causes.

They may attack systems to support a cause or protest an organization or action.

Their primary motivation is generally not simply financial gain.

### Key idea

The important clue is the **cause or belief motivating the attack**.

---

## Insider Adversaries

An **insider adversary** is someone who already has legitimate access to systems, facilities, or information.

This can include:

- employees
- contractors
- former employees whose access has not been removed
- people recruited by an outside attacker

Possible motivations include:

- greed
- revenge
- outside pressure
- helping another person

### Why insiders are important

A person who already has legitimate access may not need to bypass the same controls as an outside attacker.

This is one reason organizations use:

- least privilege
- access reviews
- account termination procedures
- logging
- monitoring

### Student reminder

**Insider threat = legitimate access can become a security risk.**

---

## Cyberterrorists

**Cyberterrorists** are adversaries motivated by political or ideological causes who seek to create serious disruption through cyberattacks.

Potential targets can include critical infrastructure such as:

- power systems
- water treatment systems
- transportation systems
- other civil infrastructure

The objective may be widespread disruption rather than simple theft.

---

## Transnational Criminal Organizations

**Transnational criminal organizations** primarily seek financial gain and operate across borders or jurisdictions.

Activities can include:

- deploying ransomware
- stealing intellectual property
- stealing credentials or personal information
- selling stolen information in illegal markets

### Student reminder

For AP questions, focus on the **motivation and type of activity** described in the scenario.

---

# Phases of a Cyberattack

Cyberattacks often occur in stages. Understanding the stages helps defenders identify where an attack is happening and where security controls may interrupt it.

The AP framework identifies six phases:

1. **Reconnaissance**
2. **Initial Access**
3. **Persistence**
4. **Lateral Movement**
5. **Taking Action**
6. **Evading Detection**

Not every attack will use every phase, and real attacks are not always perfectly linear.

---

## 1. Reconnaissance

**Reconnaissance** is the process of gathering information about a target before or during an attack.

An adversary may research:

- people
- organizations
- websites
- devices
- software
- network information
- employees
- publicly available documents

### OSINT

**Open Source Intelligence (OSINT)** is information that is publicly available.

Possible sources include:

- websites
- public social media posts
- public documents
- organization websites
- public records

### Why reconnaissance matters

Information that seems harmless by itself can become useful when pieces are combined.

For example, an attacker might discover an employee's:

- job title
- department
- publicly listed email
- supervisor
- technology responsibilities

That information could later make a social engineering message more believable.

### AP clue

If a question says an attacker is **researching**, **collecting information**, or **profiling the target**, think **reconnaissance**.

---

## 2. Initial Access

**Initial access** occurs when an adversary establishes an entry point into the target environment.

Possible methods include:

- social engineering
- compromised credentials
- weak credentials
- exploiting a vulnerability

### Think of it as

> **“How did the attacker get in?”**

Once the attacker has initial access, later phases may follow.

---

## 3. Persistence

**Persistence** is the ability to maintain access to a system or environment over time.

The attacker may think:

> “If my current access disappears, how can I regain access?”

The AP framework mentions mechanisms such as:

- command and control (C2)
- Remote Access Trojans (RATs)
- rootkits

### Key distinction

**Initial access** = getting in.

**Persistence** = staying able to get back in.

---

## 4. Lateral Movement

**Lateral movement** occurs when an attacker moves from one compromised system or account to other systems or accounts inside the environment.

The attacker may look for:

- other computers
- other user accounts
- more valuable systems
- systems containing sensitive data
- accounts with greater privileges

### Privilege escalation

**Privilege escalation** means gaining a higher level of access than the attacker originally had.

For example, an attacker might begin with a standard user account and attempt to reach an account with administrative permissions.

### AP clue

If the attacker is **moving around inside the organization**, think **lateral movement**.

---

## 5. Taking Action

This is the stage where the attacker attempts to accomplish their actual objective.

Examples include:

- collecting data
- stealing data
- disrupting services
- destroying data
- modifying information
- exfiltrating information

### Exfiltration

**Exfiltration** means moving stolen data out of the target environment.

### Student reminder

Think:

> **“What does the attacker ultimately want to accomplish?”**

---

## 6. Evading Detection

Attackers may try to hide evidence of what they have done.

The AP framework gives examples such as:

- removing or editing log files
- deleting files they placed on systems
- removing evidence of malware

### Why?

The longer defenders remain unaware, the more opportunity the attacker may have to continue operating.

### AP clue

If the attacker is **covering tracks** or **trying not to be noticed**, think **evading detection**.

---

# Cyberattack Phases — Simple Memory Story

Imagine an attacker targeting a school:

**Reconnaissance** → Researches the school and employees.

**Initial Access** → Tricks an employee into providing access.

**Persistence** → Establishes a way to maintain access.

**Lateral Movement** → Moves from one computer to other systems.

**Taking Action** → Steals sensitive information.

**Evading Detection** → Attempts to hide evidence.

This sequence can help you recognize phases in scenario-based questions.

---

# Risk

**Risk** occurs when a threat can exploit a vulnerability and compromise an asset.

A useful mental model is:

> **Threat + Vulnerability → Risk to an Asset**

To understand risk, you need to understand the three building blocks.

---

## Assets

An **asset** is something valuable that needs protection.

Examples include:

- money
- data
- intellectual property
- digital infrastructure
- physical property
- equipment
- reputation
- services

### Ask yourself

> **What are we trying to protect?**

If you cannot identify the asset, you will have difficulty explaining the risk.

---

## Threat

A **threat** is something capable of causing harm to an asset.

Examples include:

- an attacker
- malware
- an insider
- a natural disaster
- equipment failure
- unauthorized users

### Important distinction

A threat is not necessarily the same thing as a vulnerability.

A **threat** is what could cause harm.

A **vulnerability** is the weakness that can be exploited.

---

## Vulnerability

A **vulnerability** is a weakness or flaw that could allow an asset to be compromised.

Examples:

- an unlocked door
- weak authentication
- exposed systems
- unprotected devices
- outdated software
- poor security procedures
- unrestricted physical access

### Student reminder

Ask:

> **“What is the weakness?”**

That usually points you toward the vulnerability.

---

# Risk Assessment

A **risk assessment** is the process of examining risks and determining how serious they are.

The AP framework emphasizes two major factors:

### Likelihood

> **How likely is the attack or exploitation to happen?**

### Severity / Impact

> **How much damage could occur if it happens?**

A scenario with high likelihood and high impact generally demands significant attention.

However, risk is not determined by likelihood alone.

---

# What Affects Likelihood?

## Value of the Target

Attackers may be more interested in assets that are valuable.

A server containing sensitive information may be a more attractive target than an old computer with no important data.

---

## Skill Required

Ask:

> **How difficult is the vulnerability to exploit?**

A vulnerability that is easy to exploit may be accessible to many attackers.

A vulnerability requiring specialized expertise may have a smaller pool of potential attackers.

---

## Motivation and Capabilities of the Adversary

Different adversaries have different goals and abilities.

A highly motivated and skilled adversary may be capable of exploiting vulnerabilities that a low-skilled attacker cannot.

### AP-style thinking

Do not ask only:

> “Can this vulnerability be exploited?”

Also ask:

> **“Who is likely to try?”**

---

# Severity / Impact

**Severity** describes how much damage could occur if a vulnerability is exploited.

Damage can include several categories.

## Financial impact

How much money could be lost?

Examples:

- stolen funds
- recovery costs
- lost business
- ransom payments

## Operational impact

How much could normal operations be disrupted?

Examples:

- systems going offline
- employees being unable to work
- services being interrupted

## Reputational impact

How could trust in the organization be affected?

For example, customers may lose confidence after a serious data exposure.

### Important idea

A risk does not have to cause direct financial loss to be serious.

---

# Quantitative vs. Qualitative Risk Assessment

Risk assessments can use numerical values or descriptive categories.

## Quantitative Risk Assessment

**Quantitative risk assessment** assigns a numerical value to a risk.

Examples include:

- a score from 1–10
- $10,000 of annual expected risk
- $100,000 of expected loss

### Why use numbers?

Numbers can help organizations compare risks using measurable values.

### Example

**Risk A = $10,000 expected loss**

**Risk B = $100,000 expected loss**

The values provide a direct numerical comparison.

### Student reminder

**Quantitative = quantity = numbers.**

---

## Qualitative Risk Assessment

**Qualitative risk assessment** uses descriptive categories rather than exact numerical values.

Examples:

- Low
- Medium
- High
- Severe

A qualitative assessment may also combine likelihood and impact.

| Likelihood | Impact | Example interpretation |
|---|---|---|
| Unlikely | Low | Lower-priority concern |
| Likely | Low | Could deserve attention despite limited impact |
| Unlikely | High | Rare but potentially serious |
| Likely | High | Major concern |

### Student reminder

**Qualitative = qualities/descriptions.**

---

# Risk Assessment Documentation

A risk assessment should be documented so that the organization can explain what it identified and why it made its decisions.

The AP framework says documentation should include:

- vulnerable assets and their value
- likely threats
- specific vulnerabilities
- how those vulnerabilities could be exploited
- severity of potential damage
- likelihood of compromise
- a final quantitative or qualitative rating

A useful sequence is:

**Asset**

→ What are we protecting?

**Threat**

→ What could harm it?

**Vulnerability**

→ What weakness could be exploited?

**Likelihood**

→ How likely is exploitation?

**Impact**

→ How much damage could occur?

**Risk Rating**

→ How serious is the overall situation?

### Why this sequence matters

It prevents you from jumping directly to a security control without understanding the problem first.

---

# Managing Risk

Once a risk has been identified and assessed, an organization has four major strategies:

1. **Avoid**
2. **Transfer**
3. **Mitigate**
4. **Accept**

A common AP question gives you a scenario and asks which strategy is being used.

---

## 1. Risk Avoidance

**Risk avoidance** means stopping the activity that creates the risk.

**Example:**

A company decides not to use a particular technology because the security risk is too high.

The activity itself is removed.

### Key phrase

> **Avoid = stop the risky activity.**

---

## 2. Risk Transference

**Risk transference** means shifting some of the burden or consequences of a risk to another entity.

Examples can include:

- insurance companies
- other organizations
- government entities
- contractual arrangements

The original organization may still experience consequences, but some financial or operational burden is transferred.

### Key phrase

> **Transfer = someone else takes on some of the burden.**

---

## 3. Risk Mitigation

**Risk mitigation** means implementing controls to reduce the likelihood or impact of a risk.

Examples include:

- installing locks
- adding authentication
- encrypting data
- training employees
- installing cameras
- creating backups
- improving access controls

### Important distinction

Mitigation does not necessarily eliminate the risk.

It **reduces** the risk.

### Key phrase

> **Mitigate = make the risk smaller.**

---

## 4. Risk Acceptance

Sometimes an organization decides that a risk is acceptable and does not justify additional mitigation.

This is **risk acceptance**.

An organization may accept a risk when:

- likelihood is low
- impact is low
- mitigation would cost more than the expected loss
- the activity is necessary and cannot reasonably be avoided

### Important idea

**Accepting risk does not mean the risk does not exist.**

It means the organization knowingly chooses to live with it.

---

# Residual Risk

**Residual risk** is the risk that remains after security controls and other risk-management actions have been applied.

Example:

**Original risk**

→ High potential loss

**Security controls**

→ Reduce likelihood and/or impact

**Remaining risk**

→ Residual risk

No organization can guarantee zero risk.

The practical goal is to reduce risk to a level that the organization can manage.

---

# Cost-Effective Security

Organizations have limited:

- money
- time
- employees
- equipment
- expertise
- attention

Because of this, organizations cannot necessarily implement every possible security control.

A control should be evaluated based on its cost compared with the risk it addresses.

### Important question

> **How much does the control cost compared with the amount of risk it reduces?**

The most expensive control is not automatically the best choice.

The cheapest control is not automatically the best choice either.

The goal is to use resources intelligently.

---

# Security Controls

A **security control** is a measure used to protect systems, data, people, or physical spaces.

Security controls can be classified in multiple ways.

A single control can fit more than one category depending on what the question is asking.

For example, a camera is a **physical control** by type and a **detective control** by function.

This is an important AP concept.

---

# The CIA Triad

The CIA triad describes three fundamental goals of information security:

1. **Confidentiality**
2. **Integrity**
3. **Availability**

---

## Confidentiality

**Confidentiality** means that information is accessible only to authorized people, systems, or processes.

Without confidentiality, information could be:

- viewed by unauthorized people
- exposed
- leaked
- stolen

**Example:**

A student's private academic record should only be accessible to people who are authorized to view it.

### Memory trick

**Confidentiality = keeping information private.**

---

## Integrity

**Integrity** means information remains accurate, consistent, and trustworthy.

If an attacker changes information without authorization, integrity has been compromised.

**Example:**

If an attacker changes a student's grade without permission, the data is no longer trustworthy.

### Memory trick

**Integrity = information stays correct.**

---

## Availability

**Availability** means authorized users can access systems and information when needed.

Without availability, systems may experience:

- downtime
- service interruptions
- loss of access

**Example:**

A school's learning platform needs to be available when students and teachers need to submit and access work.

### Memory trick

**Availability = access when needed.**

---

# Three Types of Security Controls

## Physical Controls

Physical controls protect physical spaces, equipment, and people.

Examples:

- locks
- fences
- cameras
- bollards
- security guards
- access-controlled doors

### Think

> **Can I physically touch or interact with the thing being protected?**

If yes, a physical control may be involved.

---

## Technical Controls

Technical controls use technology to protect systems and information.

Examples:

- firewalls
- encryption
- anti-malware software
- authentication systems
- intrusion detection systems

---

## Managerial Controls

Managerial controls establish rules, policies, procedures, and organizational practices.

Examples:

- password policies
- access reviews
- incident response plans
- security policies
- training requirements

### Important distinction

A policy can determine **what people are required to do**, while a technical or physical control may help enforce or support that requirement.

---

# Three Functions of Security Controls

Security controls can also be classified by what they **do**.

## Preventative Controls

**Preventative controls** attempt to stop an attack or unwanted event before it happens.

Examples:

- locks
- authentication
- encryption
- physical barriers

### Think

> **Prevent = stop it before it occurs.**

---

## Detective Controls

**Detective controls** help identify attacks or suspicious activity.

Examples:

- intrusion detection systems (IDS)
- cameras
- motion sensors
- Security Information and Event Management (SIEM) systems

### Think

> **Detect = notice what is happening.**

---

## Corrective Controls

**Corrective controls** help fix problems and restore systems after an event.

Examples include:

- patching vulnerabilities
- repairing damaged access equipment
- restoring from backups
- intrusion prevention systems (IPS)

### Important idea

Corrective controls are focused on **responding to and recovering from a problem**, rather than simply detecting it.

---

# Control Type vs. Control Function

This causes confusion for many students.

Ask two separate questions:

### Question 1: What kind of control is it?

- Physical
- Technical
- Managerial

### Question 2: What does it do?

- Preventative
- Detective
- Corrective

For example:

**Security camera**

- Type: **Physical**
- Function: **Detective**

**Encryption**

- Type: **Technical**
- Function: often **Preventative**

**Security policy**

- Type: **Managerial**

The category depends on the question being asked.

---

# Defense in Depth

**Defense in depth**, also called **layered defense**, uses multiple security controls and security layers to protect systems and data.

### Why use multiple layers?

Because no single security control is perfect.

If one control fails, another may still stop, detect, or limit the attack.

The AP framework identifies six possible layers:

1. **Human**
2. **Physical**
3. **Network**
4. **Device**
5. **Application**
6. **Data**

---

## Example of Defense in Depth

Imagine a company protects sensitive information using:

**Human layer**

→ Security awareness training

**Physical layer**

→ Locked server room

**Network layer**

→ Firewall

**Device layer**

→ Endpoint security software

**Application layer**

→ Authentication and access controls

**Data layer**

→ Encryption

An attacker who bypasses one layer still has additional barriers to overcome.

### The key idea

> **Defense in depth does not mean making one defense stronger. It means creating multiple layers of defense.**

### AP scenario clue

When a scenario describes several different controls working together, think:

> **Defense in depth.**

---

# 2.2 — Physical Vulnerabilities and Attacks

Physical attacks target physical spaces, equipment, or people.

A physical attack can result in:

- loss
- damage
- disruption
- destruction
- unauthorized access
- data theft
- data exposure

The important connection is:

> **A physical problem can become a cybersecurity problem.**

---

# Piggybacking

**Piggybacking** occurs when an unauthorized person uses social engineering to get an authorized person to allow them into a restricted area.

Examples include:

- pretending to have forgotten an access card
- pretending to be maintenance staff
- carrying a large object and asking someone to hold the door

The authorized person is aware that another person is entering.

### Memory trick

> **Piggybacking = the person is “helping” the unauthorized person get in.**

---

# Tailgating

**Tailgating** occurs when an unauthorized person follows an authorized person into a restricted area without that person's awareness or knowledge.

**Example:**

An employee badges into a secure building. Another person follows closely through the door before it closes.

### Piggybacking vs. Tailgating

**Piggybacking**

→ Authorized person is aware of and allows the entry.

**Tailgating**

→ Unauthorized person follows without the authorized person's awareness.

### Why the distinction matters

Both attacks exploit physical access controls, but the difference is the role of the authorized person.

---

# Shoulder Surfing

**Shoulder surfing** means observing someone while they access or enter sensitive information.

An attacker might observe:

- passwords
- PINs
- authentication codes
- confidential documents
- information displayed on a screen

The attacker does not necessarily need to touch the device.

### Defense ideas

- privacy screens
- choosing a safer viewing position
- protecting documents from casual observation
- paying attention to people nearby

---

# Dumpster Diving

**Dumpster diving** is searching through physical trash for information that could help an attacker.

Discarded material might contain:

- printed account information
- schedules
- internal documents
- contact information
- other sensitive material

### Why this matters

Information security includes information that is no longer actively being used.

Organizations should properly dispose of sensitive documents and media.

---

# Card Cloning

**Card cloning** occurs when an attacker creates a copy of an authorized user's access card.

If successful, the copied card may allow unauthorized access to resources protected by the original card.

This demonstrates why physical access systems should not rely on a single control when the protected area is highly sensitive.

---

# Physical Vulnerabilities

A **physical vulnerability** is a weakness in the physical environment that could allow an asset to be compromised.

Examples:

- unlocked server rooms
- unsecured doors
- unprotected computers
- exposed USB ports
- poorly protected equipment
- equipment placed in public areas

### AP-style question

If the scenario describes a weakness in the building, access process, equipment placement, or physical environment, think **physical vulnerability**.

---

# Natural Threats

Not every threat is a human attacker.

Natural events can also create cybersecurity risks.

Examples include:

- floods
- fires
- severe weather
- other natural disasters

These events can damage:

- computers
- servers
- network equipment
- electrical systems
- data storage

They can also make services unavailable even when no attacker is involved.

### Important idea

Cybersecurity protects **availability** as well as confidentiality and integrity.

A disaster that prevents access to a system can be a cybersecurity concern because availability has been affected.

---

# Power Disruption

Power disruption can create both physical and cybersecurity consequences.

The AP framework identifies possibilities such as damage to:

- fuses
- breakers
- electrical wiring
- power distribution systems

A loss of power can make systems unavailable and may damage equipment.

### Security controls

Organizations may use:

- surge protectors
- UPS systems
- generators

These controls reduce risk associated with power interruptions.

---

# Physical Access to Sensitive Information

If an attacker enters an area containing sensitive information, they may be able to:

- steal information
- copy information
- photograph information
- view confidential documents
- access devices that contain information

This shows why a secure network alone is not enough.

---

# Physical Access to Devices

Direct access to a device may allow an attacker to interact with hardware in ways that a remote attacker cannot.

The AP framework gives examples such as:

- keyloggers
- external drives containing malware

Physical access may also allow someone to damage or destroy equipment.

### Student takeaway

> **Physical access can create new attack possibilities that do not exist remotely.**

---

# Why Physical Access Is So Important

A computer may have:

- a password
- encryption
- firewall protection
- anti-malware software

But those controls do not eliminate every physical threat.

This is why physical security is considered a foundational layer of cybersecurity.

> **Protect the device, the room, and the people around the device.**

---

# Assessing Physical Risk

When analyzing a physical-security scenario, use the same risk framework used elsewhere in cybersecurity.

### 1. What is the asset?

What are we protecting?

### 2. What is the vulnerability?

What physical weakness exists?

### 3. What is the threat?

Who or what could exploit the weakness?

### 4. What could happen?

Potential outcomes may include:

- data theft
- device theft
- service disruption
- data modification
- physical destruction

### 5. How likely is it?

Think about access, opportunity, motivation, and difficulty.

### 6. How severe would it be?

Think about financial, operational, and reputational effects.

---

# Physical Risk Examples

## High Physical Risk

High risk may occur when highly valuable systems or information are exposed and access controls are weak.

**Example:**

A server containing sensitive customer information is located in an unlocked room connected to an unmonitored hallway.

The asset is valuable, the vulnerability is significant, and unauthorized access could have serious consequences.

---

## Moderate Physical Risk

Moderate risk may occur when an asset is not extremely valuable by itself but could provide access to other resources.

**Example:**

A receptionist's computer is not itself the most valuable asset, but it connects to the internal network and has exposed ports.

The machine could potentially become a foothold.

---

## Low Physical Risk

Risk may be lower when:

- the asset has low value
- the vulnerability is difficult to exploit
- the likelihood is low
- the potential consequences are limited

**Example:**

Employees temporarily leave inexpensive laptops unattended, but the building requires badge access and the laptops contain no sensitive information.

### Important note

“Low” does not mean “no risk.” It means the risk is comparatively limited based on the scenario.

---

# 2.3 — Protecting Physical Spaces

Once a vulnerability has been identified, the next question is:

> **What control should we use to reduce the risk?**

This section focuses strongly on **risk mitigation**.

A good answer does not simply name a control. It explains **why that control fits the vulnerability**.

---

# Security Awareness Training

Employees are part of an organization's security system.

Training can help people recognize and respond to threats such as:

- phishing
- social engineering
- unauthorized physical access
- suspicious behavior
- device theft

Employees should understand what to do when they encounter an unknown person or suspicious request.

### Important idea

People can be both a vulnerability and a security control.

Good training can reduce the likelihood that a person will accidentally help an attacker.

---

# Workstation Security Policies

Organizations should create policies explaining how workstations should be protected.

The exact requirements may depend on what the workstation handles.

Policies can address:

- locking the device
- protecting documents
- screen visibility
- use of removable media
- physical placement of equipment

---

## Lock Your Device

Employees should lock devices when leaving them unattended.

This reduces the chance that someone nearby can use an unlocked computer.

### Why it matters

Physical proximity can turn a harmless situation into an access opportunity.

---

## Clean Desk Policy

A **clean desk policy** requires employees to secure or remove sensitive documents and information when leaving a workstation.

The goal is to reduce unauthorized exposure or theft of information.

### Example

Leaving a printed list of user accounts on a desk may create unnecessary exposure, even if the computer itself is protected.

---

## Privacy Screens

A **privacy screen** helps prevent people nearby from viewing information on a display.

This is especially useful in:

- public areas
- open offices
- airports
- classrooms
- shared workspaces

A privacy screen directly addresses **visual information exposure**.

---

## Surge Protectors

A **surge protector** helps protect equipment from electrical surges.

This is a physical control that reduces equipment damage from power-related events.

---

## Uninterruptible Power Supply (UPS)

An **uninterruptible power supply**, or **UPS**, provides temporary backup power when normal power is lost.

A UPS can:

- keep a device running temporarily
- provide time for a safe shutdown
- reduce disruption from short power failures

A UPS is especially useful for equipment that should not suddenly lose power.

---

# Choosing Physical Security Controls

A strong security decision starts with the vulnerability.

Ask:

> **How could the attacker exploit the vulnerability?**

Then ask:

> **What control would prevent, detect, or correct that attack?**

This is one of the most important problem-solving habits in AP Cybersecurity.

### Weak reasoning

> “Add more cameras.”

### Strong reasoning

> “The vulnerability is that the entrance is unmonitored. A camera placed at the entrance could provide detective coverage and create evidence of unauthorized activity.”

The second answer connects the control to the problem.

---

# Fences, Gates, and Bollards

Physical barriers can make it harder for unauthorized people or vehicles to reach a protected area.

Examples:

- fences
- gates
- bollards

These controls can reduce opportunities for unauthorized physical access.

---

# Locks

Locks can protect:

- doors
- server cabinets
- equipment rooms
- computers
- storage areas

Locks are especially useful when the vulnerability involves uncontrolled access.

### Remember

A lock protects an entry point; it does not eliminate every possible attack.

That is why higher-security environments may combine locks with cameras, badges, guards, and other controls.

---

# Card Readers

Card readers can:

- restrict access
- identify the badge being used
- record access times
- deny unauthorized badges

Access logs can also support later investigation.

### Security principle

A badge system does more than open a door. It can also generate information about **who attempted to enter and when**.

---

# Access Control Vestibules and Turnstiles

An **access control vestibule** is a controlled entry area intended to make unauthorized entry behind an authorized person more difficult.

A **turnstile** can similarly regulate how people enter an area.

These controls can help reduce:

- piggybacking
- tailgating

### Student clue

If the scenario involves stopping one person from slipping in immediately behind another, think about **controlled entry points**.

---

# Disabling USB Ports

Organizations may disable USB ports when appropriate.

This can reduce the chance that someone physically connects an external device that could introduce malware or copy information.

### Important tradeoff

Disabling ports can improve security, but it may also reduce convenience or interfere with legitimate work. Security decisions often require balancing protection with usability and operational needs.

---

# Backup Power

Organizations may use:

### UPS

Backup power for individual devices or smaller systems.

### Generator

Backup power at a larger scale for buildings or critical infrastructure.

### Why this matters

Both controls improve **availability** during power disruptions.

---

# Prioritizing Mitigations

An organization can have many vulnerabilities but limited resources.

It must decide which risks deserve attention first.

The AP framework says mitigations should be prioritized based on factors such as:

- severity of the risk
- cost of the mitigation

### Important idea

Do not assume:

> **“The most expensive control is the best control.”**

Instead ask:

> **“How serious is the risk, and how much does the mitigation cost?”**

### AP-style reasoning

If two controls address the same vulnerability, a question may expect you to consider which one provides an appropriate level of risk reduction for the available resources.

---

# 2.4 — Detecting Physical Attacks

Preventing attacks is only part of cybersecurity.

Organizations must also determine:

> **Is something suspicious happening right now?**

Detection controls help provide that information.

---

# Security Cameras

Cameras can create a visual record of activity.

They can help:

- detect suspicious activity
- monitor an area
- investigate incidents
- track actions
- provide evidence after an event

### Important limitation

A camera may record an event without physically stopping it.

That is why cameras are usually associated with **detection**, not prevention.

For maximum usefulness, camera feeds may be monitored and/or recorded.

---

# Security Guards

Security guards can monitor physical spaces and respond to suspicious activity.

## Stationary guards

Remain in a specific location.

Useful for:

- entrances
- lobbies
- gates
- high-value rooms
- access points

## Patrolling guards

Move through different areas.

Patrols can make it less predictable where a guard will be at any given moment.

### Student clue

Think about **where the guard needs to be** in relation to the threat.

---

# Motion Sensors

Motion sensors detect movement.

They can be especially useful in places where unexpected movement is unusual.

Examples:

- server rooms
- restricted storage
- sensitive equipment areas

### Placement matters

A motion detector in a server room may be useful because very little unauthorized movement should occur there.

A motion detector in a busy hallway could produce many alerts because movement is normal.

---

# False Alarms

A **false alarm** occurs when a security system reports a potential problem even though there is no actual attack or security incident.

Too many false alarms can create **alarm fatigue**.

### Alarm fatigue

If users receive many alerts that turn out to be harmless, they may become less likely to take future alerts seriously.

This means a detection system should be configured and placed carefully.

### Student takeaway

More alerts do not automatically mean better security.

Useful alerts are more valuable than constant noise.

---

# Why Placement Matters

A security control is only useful if it is placed where it can accomplish its purpose.

This is a major AP concept.

> **Do not only choose a security control. Choose where and how it should be used.**

A perfect control in the wrong location can still fail to protect the asset.

---

# Camera Placement

When deciding where to place a camera, consider:

### Coverage

Can it see the area that actually needs monitoring?

### Angle

Does it provide a useful view?

### Tampering

Can an attacker easily disable or interfere with it?

### Purpose

What are you trying to observe?

### Entry and Exit Points

Entrances and exits are often useful locations because physical movement is concentrated there.

---

# Motion Sensor Placement

Motion sensors work best where movement is unexpected.

### Good example

A restricted server room normally has limited movement.

Unexpected motion may be significant.

### Poorer example

A busy hallway has constant movement.

A motion detector there may generate many unnecessary alerts.

### Lesson

The effectiveness of a control depends partly on the environment in which it is deployed.

---

# Locks as Part of Detection

Locks are primarily associated with **preventing** unauthorized access.

However, access-control systems can also create records or alerts showing attempts to enter.

For example, an electronic access system might record:

- who used a badge
- when the badge was used
- whether access was granted or denied

This means one system can support multiple security goals.

---

# Security Guard Placement

## Stationary guards

Useful where people naturally pass through:

- main entrances
- gates
- lobbies
- restricted entrances

## Patrolling guards

Useful around:

- perimeters
- exterior areas
- large spaces
- areas where suspicious activity could move between locations

---

# Combining Detection Controls

Security controls can work together.

Example:

**Motion sensor**

→ Detects movement

↓

**Camera**

→ Shows what caused the movement

↓

**Security personnel**

→ Investigate and respond

This creates a stronger detection process than relying on a single signal.

---

# Cameras + Motion Sensors

A possible detection process is:

1. Motion sensor detects movement.
2. Security personnel receive an alert.
3. Camera footage is checked.
4. Personnel determine whether the activity is legitimate.
5. Appropriate action is taken.

### Why combine controls?

One control can provide a signal while another provides context.

The sensor answers:

> **“Something moved.”**

The camera helps answer:

> **“What moved?”**

A person can then answer:

> **“Is this actually a problem?”**

---

# Electronic Badge Detection

Electronic badges can provide useful information about access activity.

For example, a door system may record how long a restricted door remains open.

If a door that normally closes within a few seconds stays open much longer, that could indicate:

- piggybacking
- tailgating
- equipment malfunction
- another unusual event

### Important reasoning

An unusual event should be **investigated**, not automatically labeled as an attack.

Good cybersecurity analysis considers alternative explanations.

---

# How Prevention and Detection Work Together

Prevention and detection answer different questions.

### Prevention

> **How can we stop the event?**

### Detection

> **How can we know the event is happening?**

### Correction / response

> **How can we fix the problem and restore normal operation?**

A strong security system often needs all three.

---

# A Complete Risk-to-Control Example

Imagine a company stores sensitive customer data in a server room.

### Step 1 — Asset

The sensitive customer data and servers are the assets.

### Step 2 — Threat

An unauthorized person could enter the room.

### Step 3 — Vulnerability

The server room door is unlocked.

### Step 4 — Likelihood

People pass through the nearby hallway, so unauthorized access is possible.

### Step 5 — Impact

Physical access could lead to data theft, device tampering, or service disruption.

### Step 6 — Mitigation

Install a lock and badge reader.

### Step 7 — Detection

Add a camera or access logging.

### Step 8 — Defense in Depth

Combine:

- badge access
- camera monitoring
- security training
- device protections
- data encryption

Now there are multiple layers.

### Step 9 — Residual Risk

Even after controls are deployed, some risk remains.

The organization decides whether the remaining risk is acceptable.

This is the overall reasoning pattern of the unit.

---

# Unit 2 — What You Need to Remember

## The Risk Model

> **Threat + Vulnerability → Risk to an Asset**

Then evaluate:

> **Likelihood + Impact → Risk Assessment**

### Remember the meanings

**Asset** = what has value.

**Threat** = what could cause harm.

**Vulnerability** = the weakness.

**Likelihood** = how probable exploitation is.

**Impact/Severity** = how much damage could occur.

**Risk** = the overall concern created by the threat exploiting the vulnerability against the asset.

---

# The Four Risk Strategies

Memorize:

> **Avoid → Transfer → Mitigate → Accept**

### Avoid

Stop the risky activity.

### Transfer

Shift some burden or consequences to another entity.

### Mitigate

Use controls to reduce likelihood and/or impact.

### Accept

Knowingly accept the remaining risk.

---

# Quantitative vs. Qualitative

### Quantitative

Uses numbers.

Examples:

- 1–10
- $10,000
- 25%

### Qualitative

Uses descriptive categories.

Examples:

- Low
- Medium
- High
- Severe

### Memory trick

> **Quantitative = quantity = numbers.**

> **Qualitative = qualities = descriptions.**

---

# CIA

### C — Confidentiality

Only authorized access.

### I — Integrity

Data stays accurate and trustworthy.

### A — Availability

Authorized users can access systems and data when needed.

### Quick check

Ask:

- **Confidentiality:** Who can see it?
- **Integrity:** Is it still correct?
- **Availability:** Can we use it when needed?

---

# Security Control Types

### Physical

Protects physical spaces and equipment.

Examples: locks, fences, guards, cameras.

### Technical

Uses technology to protect systems and data.

Examples: firewalls, encryption, anti-malware.

### Managerial

Creates policies, rules, and procedures.

Examples: policies, procedures, training requirements.

---

# Security Control Functions

### Preventative

Stops or blocks an attack before it succeeds.

### Detective

Finds or identifies suspicious activity.

### Corrective

Fixes problems or helps restore the environment.

---

# Defense in Depth

Use multiple layers:

> **Human → Physical → Network → Device → Application → Data**

The purpose is not to create six identical defenses.

The purpose is to create different layers that support one another.

---

# Physical Attack Terms

### Piggybacking

Manipulating or persuading someone into granting access.

### Tailgating

Following an authorized person into a restricted area without their awareness.

### Shoulder surfing

Watching someone access sensitive information.

### Dumpster diving

Searching physical trash for useful information.

### Card cloning

Creating a copy of an access card.

---

# Cyberattack Phase Terms

### Reconnaissance

Gathering information.

### Initial Access

Getting into the target environment.

### Persistence

Maintaining or regaining access.

### Lateral Movement

Moving to other systems or accounts.

### Taking Action

Accomplishing the attacker's objective.

### Evading Detection

Hiding evidence or avoiding discovery.

---

# AP Skill: Analyze Risk

When you see a scenario, use this checklist:

### 1. Asset

What is valuable?

### 2. Threat

What could cause harm?

### 3. Vulnerability

What weakness exists?

### 4. Likelihood

How likely is exploitation?

### 5. Impact

How much damage could occur?

### 6. Risk

How serious is the overall situation?

### Student strategy

Do not jump straight to the solution.

First diagnose the problem.

---

# AP Skill: Mitigate Risk

When asked how to reduce risk:

1. Identify the vulnerability.
2. Explain how an adversary could exploit it.
3. Choose an appropriate security control.
4. Explain how the control reduces likelihood or impact.
5. Consider cost and operational consequences.

### Strong answer pattern

> **The vulnerability is ____. A suitable control is ____. This reduces risk by ____ because ____.**

This structure helps turn a vocabulary answer into an explanation.

---

# AP Skill: Detect Attacks

When asked how to detect an attack:

1. Identify what should be monitored.
2. Choose an appropriate detection control.
3. Place the control where it can collect useful evidence.
4. Look for unusual activity.
5. Analyze the evidence.
6. Determine whether a response is necessary.

### Strong answer pattern

> **Monitor ____ using ____. Place the control at ____ because that is where suspicious activity would be visible.**

---

# AP Skill: Choose the Right Control

A useful decision process is:

### Step 1

What is the vulnerability?

### Step 2

What is the threat?

### Step 3

Do we need to:

- prevent it?
- detect it?
- correct it?

### Step 4

Which control fits the environment?

### Step 5

Where should the control be placed?

### Step 6

Is the solution cost-effective?

### Step 7

What residual risk remains?

This is more reliable than memorizing one control for each threat.

---

# Common Student Confusions

## Threat vs. Vulnerability

**Threat** = what could cause harm.

**Vulnerability** = the weakness that can be exploited.

Example:

- Threat: unauthorized person
- Vulnerability: unlocked door
- Asset: server

---

## Likelihood vs. Impact

**Likelihood** = how likely it is.

**Impact** = how bad it would be.

Something can be:

- likely but low impact
- unlikely but high impact
- likely and high impact
- unlikely and low impact

Do not automatically assume “unlikely” means “unimportant.”

---

## Initial Access vs. Persistence

**Initial Access** = get in.

**Persistence** = stay able to get in.

---

## Piggybacking vs. Tailgating

**Piggybacking** = authorized person knows and allows the entry.

**Tailgating** = unauthorized person follows without awareness.

---

## Preventative vs. Detective

**Preventative** = tries to stop the event.

**Detective** = tries to discover the event.

A camera typically detects.

A lock typically prevents.

---

## Physical vs. Technical vs. Managerial

Think about what the control **is**.

- Lock → physical
- Firewall → technical
- Security policy → managerial

Then ask what the control **does**.

- Lock → often preventative
- Camera → detective
- Patch → corrective

---

# Scenario Practice

## Scenario 1 — Social Engineering

A caller says they work for the school's technology department and claims that a student's account will be disabled in ten minutes unless the student gives them their password.

### Think about it

What tactics are present?

**Authority** because the caller claims to be from IT.

**Urgency** because there is a short deadline.

**Intimidation** may also be present because the caller threatens account loss.

### Lesson

A single social engineering attempt can use multiple tactics.

---

## Scenario 2 — Physical Access

An employee enters a secure building using a badge. Another person follows directly behind them without speaking.

### Answer

This is **tailgating**.

The key clue is that the authorized employee does not knowingly grant permission.

---

## Scenario 3 — Risk Assessment

A company stores sensitive records on a server located in an unlocked room.

### Identify the pieces

**Asset:** sensitive records/server

**Threat:** unauthorized person

**Vulnerability:** unlocked room

**Impact:** possible data theft or disruption

**Likelihood:** depends on access and opportunity

### Lesson

A strong answer identifies the whole risk chain instead of naming only the unlocked door.

---

## Scenario 4 — Control Selection

A server room has no monitoring. Unauthorized people could enter without being noticed.

### Possible control

A camera could provide detection and evidence.

A lock or badge reader could provide prevention.

A strong security design may use **both**.

### Lesson

Controls can complement one another.

---

## Scenario 5 — Detection Placement

A motion sensor is installed in a busy hallway where people walk constantly.

### Problem

The sensor may produce many false alarms.

### Better approach

Place the sensor in a restricted room where movement is unusual and therefore more meaningful.

### Lesson

The location of a control matters as much as the control itself.

---

# Unit 2 Review Questions

Use these to test yourself without looking back at the definitions.

### Question 1

What is the difference between a threat and a vulnerability?

### Question 2

What are the two major factors used in risk assessment?

### Question 3

What is the difference between quantitative and qualitative risk assessment?

### Question 4

What are the four major risk-management strategies?

### Question 5

What is residual risk?

### Question 6

What does the “C” in CIA stand for?

### Question 7

What is the difference between confidentiality and integrity?

### Question 8

Why is availability a security goal?

### Question 9

What are the three major control types?

### Question 10

What are the three major control functions?

### Question 11

What is defense in depth?

### Question 12

How are piggybacking and tailgating different?

### Question 13

What is reconnaissance?

### Question 14

What is the difference between initial access and persistence?

### Question 15

What is lateral movement?

### Question 16

What is exfiltration?

### Question 17

Why can physical access create cybersecurity risk?

### Question 18

What is alarm fatigue?

### Question 19

Why does camera or sensor placement matter?

### Question 20

How do you decide whether a mitigation is cost-effective?

---

# Unit 2 Exam Checklist

Before a test, make sure you can do all of the following:

- explain the major social engineering tactics
- recognize phishing, spear phishing, whaling, vishing, and smishing
- identify the major adversary types
- identify each phase of a cyberattack
- distinguish asset, threat, vulnerability, likelihood, impact, and risk
- distinguish quantitative from qualitative assessment
- explain avoid, transfer, mitigate, and accept
- explain residual risk
- explain the CIA triad
- classify controls as physical, technical, or managerial
- classify controls as preventative, detective, or corrective
- explain defense in depth
- recognize piggybacking and tailgating
- identify physical vulnerabilities
- explain why physical access matters
- choose a control based on a vulnerability
- explain why control placement matters
- recognize false alarms and alarm fatigue
- explain how multiple controls work together

---

# Unit 2 Big Idea

> ## Secure the Space. Assess the Risk. Layer the Defenses. Detect the Attack.

Cybersecurity is not only about protecting a computer after an attacker gets inside.

A cybersecurity professional should think about the entire environment.

**Who could attack?**

↓

**What are they trying to reach?**

↓

**What vulnerabilities exist?**

↓

**How likely is exploitation?**

↓

**What could happen?**

↓

**How should we manage the risk?**

↓

**What controls should we use?**

↓

**Where should those controls be placed?**

↓

**How would we know if an attack occurred?**

That sequence represents the mindset this unit is trying to develop.

---

# Unit 2 Master Summary

| Concept | Student-friendly meaning |
|---|---|
| **Asset** | Something valuable that needs protection |
| **Threat** | Something capable of causing harm |
| **Vulnerability** | A weakness that can be exploited |
| **Risk** | The possibility of harm when a threat exploits a vulnerability against an asset |
| **Likelihood** | How likely exploitation is |
| **Impact / Severity** | How much damage could occur |
| **Quantitative** | Uses numbers |
| **Qualitative** | Uses descriptive categories |
| **Avoid** | Stop the risky activity |
| **Transfer** | Shift some burden or consequences to another entity |
| **Mitigate** | Reduce likelihood and/or impact |
| **Accept** | Knowingly accept the remaining risk |
| **Residual Risk** | Risk that remains after controls are applied |
| **Confidentiality** | Prevent unauthorized access to information |
| **Integrity** | Keep information accurate and trustworthy |
| **Availability** | Keep systems and information accessible when needed |
| **Physical Control** | Protects physical spaces and equipment |
| **Technical Control** | Uses technology to protect systems and data |
| **Managerial Control** | Uses policies, procedures, and organizational rules |
| **Preventative** | Attempts to stop an event |
| **Detective** | Finds or identifies an event |
| **Corrective** | Fixes or restores after an event |
| **Defense in Depth** | Multiple layers of protection |
| **Piggybacking** | Unauthorized access enabled knowingly by an authorized person |
| **Tailgating** | Following an authorized person without their awareness |
| **Shoulder Surfing** | Watching someone access information |
| **Dumpster Diving** | Searching trash for useful information |
| **Card Cloning** | Copying an access card |
| **Reconnaissance** | Gathering information about a target |
| **Initial Access** | Establishing a way into the target |
| **Persistence** | Maintaining or regaining access |
| **Lateral Movement** | Moving between systems or accounts |
| **Taking Action** | Accomplishing the attacker's objective |
| **Evading Detection** | Hiding evidence or avoiding discovery |
| **OSINT** | Publicly available information used for intelligence |
| **Alarm Fatigue** | Becoming less responsive because of excessive false alerts |

---

# The Most Important Unit 2 Sequence

> **Identify → Assess → Manage → Protect → Detect**

### Identify

What are the assets, threats, and vulnerabilities?

### Assess

How likely is exploitation and how severe would the impact be?

### Manage

Should the organization avoid, transfer, mitigate, or accept the risk?

### Protect

Which security controls should be used, and how should they be layered?

### Detect

How will the organization know if something suspicious happens?

> **If you can apply this sequence to a scenario, you understand the core reasoning of Unit 2.**
