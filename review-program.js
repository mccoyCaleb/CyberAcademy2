(function () {
  const reviewBanks = {
    'unit-1': [
      { prompt: 'A student receives an email warning that their school account will be deleted in 15 minutes. What is the most likely attack?', options: ['Phishing', 'Denial of service', 'Rogue DHCP', 'Tailgating'], answer: 'Phishing', explanation: 'The email creates urgency and sends the user to an unfamiliar login page, which is classic phishing.' },
      { prompt: 'A message appears to come from the robotics advisor and references the student’s team and competition. What attack is most likely?', options: ['Smishing', 'Spear phishing', 'Brute force', 'MAC flooding'], answer: 'Spear phishing', explanation: 'The attacker used personal details to make the message look trustworthy and targeted.' },
      { prompt: 'The finance director receives a polished email from a fake superintendent asking for a payroll export. Which attack fits best?', options: ['Whaling', 'Buffer overflow', 'ARP spoofing', 'Dumpster diving'], answer: 'Whaling', explanation: 'Whaling is a high-value phishing attack aimed at senior or privileged users.' },
      { prompt: 'A text says a package cannot be delivered unless a fee is paid at a link. What is this attack?', options: ['Vishing', 'Smishing', 'Baiting', 'Ransomware'], answer: 'Smishing', explanation: 'The attack uses SMS and a fake delivery problem to trick the victim into clicking a malicious link.' },
      { prompt: 'A caller claims to be school IT and asks a student to read a one-time login code aloud. What is the attacker exploiting?', options: ['Urgency and authority', 'A broken DNS server', 'Weak wireless encryption', 'A MAC address table'], answer: 'Urgency and authority', explanation: 'The caller uses fear and pretend-authority to get the student to reveal a live authentication code.' },
      { prompt: 'A substitute teacher calls the help desk and asks to reset a principal’s account. What deception is this?', options: ['Piggybacking', 'Pretexting', 'Password spraying', 'XSS'], answer: 'Pretexting', explanation: 'The attacker invents a story and false identity to justify a sensitive request.' },
      { prompt: 'A post promises a rare game skin in exchange for downloading a file and disabling antivirus. Which social engineering technique is involved?', options: ['Baiting', 'Shoulder surfing', 'Jamming', 'Credential stuffing'], answer: 'Baiting', explanation: 'The lure is an appealing reward paired with a dangerous instruction to bypass protection.' },
      { prompt: 'A stranger asks a student to hold a door open to a restricted room. What physical attack is this?', options: ['Tailgating', 'Dumpster diving', 'Evil twin', 'DoS'], answer: 'Tailgating', explanation: 'An unauthorized person slips in behind an authorized person without proper verification.' },
      { prompt: 'A student uses the same password for school, gaming, and email. A gaming service reports a breach. What attack pattern is most likely?', options: ['Credential stuffing', 'SQL injection', 'Rogue DHCP', 'Smurf attack'], answer: 'Credential stuffing', explanation: 'Attackers use known username/password pairs across multiple sites when passwords are reused.' },
      { prompt: 'An attacker tries the same common password against many student accounts instead of trying many guesses on one account. Which attack is this?', options: ['Password spraying', 'Phishing', 'XSS', 'Tailgating'], answer: 'Password spraying', explanation: 'The attacker spreads a small number of likely passwords across many accounts to avoid lockouts.' }
    ],
    'unit-2': [
      { prompt: 'A visitor says they forgot their badge and asks an employee to hold the door. The employee knowingly lets them in. What is this?', options: ['Piggybacking', 'Tailgating', 'Shoulder surfing', 'Jamming'], answer: 'Piggybacking', explanation: 'This is authorized assistance for unauthorized entry, which is piggybacking.' },
      { prompt: 'A person watches over a staff member’s shoulder while they type a password. What physical attack is this?', options: ['Shoulder surfing', 'MAC flooding', 'URL poisoning', 'SQL injection'], answer: 'Shoulder surfing', explanation: 'The attacker learns a credential by observing it in person.' },
      { prompt: 'Sensitive records are found in an unlocked recycling area. What type of risk is this?', options: ['Dumpster diving', 'ARP spoofing', 'Rogue AP', 'Password spraying'], answer: 'Dumpster diving', explanation: 'Improper disposal exposes sensitive data to people who can use it for social engineering or account attacks.' },
      { prompt: 'A staff badge still opens doors after it was briefly out of sight at a crowded event. What is the likely issue?', options: ['A cloned or stolen badge', 'A DNS cache issue', 'A brute-force attack', 'An ACL order problem'], answer: 'A cloned or stolen badge', explanation: 'Unauthorized duplicate use of a badge is a strong sign of cloning or theft.' },
      { prompt: 'A maintenance door to a network closet is propped open and an unknown cable is connected. What vulnerability is exposed?', options: ['Physical access control failure', 'Session hijacking', 'Buffer overflow', 'SQL injection'], answer: 'Physical access control failure', explanation: 'The open door and unknown cable indicate the facility is not controlling physical access or network ports.' },
      { prompt: 'Classroom laptops begin receiving a gateway and DNS server from an unfamiliar device. What service is being abused?', options: ['DHCP', 'SMTP', 'ARP', 'NAT'], answer: 'DHCP', explanation: 'DHCP provides network configuration, including the default gateway and DNS server.' },
      { prompt: 'Several students type the correct school website name but are sent to a fake login page. What should be suspected?', options: ['DNS spoofing or cache poisoning', 'A wireless jamming attack', 'A rogue DHCP lease', 'A MAC flooding table'], answer: 'DNS spoofing or cache poisoning', explanation: 'Unexpected DNS answers can redirect users to a look-alike site.' },
      { prompt: 'A web log shows repeated 404 errors followed by a 403 for an admin page. Can this prove intent?', options: ['No, it only shows requests and server responses', 'Yes, it proves a script was used', 'Yes, it proves the user is malicious', 'No, it proves an antivirus issue'], answer: 'No, it only shows requests and server responses', explanation: 'Logs show activity and server decisions, not the person’s intent by themselves.' },
      { prompt: 'Logs show a successful login after multiple failed attempts, then a request to download many records. What should investigators check first?', options: ['Expected device, time, MFA, and related access logs', 'Whether the keyboard is wireless', 'Whether the firewall has a rule for port 53', 'Whether ARP requests are enabled'], answer: 'Expected device, time, MFA, and related access logs', explanation: 'The pattern needs context such as device and authorization records to judge whether compromise occurred.' },
      { prompt: 'A room uses badge readers, cameras, visitor rules, and a recovery plan. What do these examples illustrate?', options: ['Defense in depth', 'A single point of failure', 'Only preventive controls', 'Only technical controls'], answer: 'Defense in depth', explanation: 'Multiple layers reduce the chance that one control alone will fail.' },
      { prompt: 'A brief power loss shuts down a switch, and a surge damages another device when power returns. Which risks are present?', options: ['Availability loss and equipment damage', 'Only a software bug', 'Only a rogue AP', 'Only a physical access breach'], answer: 'Availability loss and equipment damage', explanation: 'Power interruption affects availability, and surges can damage equipment.' },
      { prompt: 'A school stores student records on a laptop in a room that floods repeatedly. What is the most direct treatment?', options: ['Avoid the risk by moving or protecting the system', 'Ignore it because it is only a laptop', 'Turn off all logging', 'Disable the firewall'], answer: 'Avoid the risk by moving or protecting the system', explanation: 'The risk is heightened by repeated flooding, so avoidance or mitigation reduces the exposure.' }
    ],
    'unit-3': [
      { prompt: 'Several computers report that the gateway IP is mapped to a different MAC address than usual. What attack might be happening?', options: ['ARP spoofing', 'Buffer overflow', 'XSS', 'Rogue DHCP'], answer: 'ARP spoofing', explanation: 'ARP spoofing causes fake IP-to-MAC mappings and can create an on-path attack.' },
      { prompt: 'A switch relearns many source MAC addresses on one port and users intermittently lose connectivity. What attack is plausible?', options: ['MAC flooding', 'DNS cache poisoning', 'Tailgating', 'Credential stuffing'], answer: 'MAC flooding', explanation: 'A flood of forged source MAC addresses can overwhelm the switch’s forwarding table.' },
      { prompt: 'A user enters a familiar bank address but is redirected to a convincing fake page. What is the likely network attack?', options: ['DNS spoofing or cache poisoning', 'Smishing', 'Jamming', 'Baiting'], answer: 'DNS spoofing or cache poisoning', explanation: 'The wrong host result often indicates malicious or incorrect DNS responses.' },
      { prompt: 'A public service receives traffic from many sources and becomes unavailable. What family of attack is this?', options: ['DDoS', 'ARP spoofing', 'Tailgating', 'Phishing'], answer: 'DDoS', explanation: 'The attack uses distributed traffic from many sources to overwhelm the service.' },
      { prompt: 'Many echo replies arrive after traffic is sent to a broadcast address with a forged victim source. What attack is this?', options: ['Smurf attack', 'Credential stuffing', 'Password spraying', 'SQL injection'], answer: 'Smurf attack', explanation: 'The broadcast amplifies traffic and sends the replies to the victim, creating reflection.' },
      { prompt: 'An access point with a name nearly identical to the school’s appears in a hallway. What is the likely risk?', options: ['A rogue access point or evil twin', 'A weak password policy', 'A DNS server issue', 'A broken router'], answer: 'A rogue access point or evil twin', explanation: 'The AP may impersonate a trusted network and capture user traffic.' },
      { prompt: 'Users near a meeting room lose wireless connectivity and the network team sees unusual radio interference. What should be considered?', options: ['Wireless jamming or interference', 'Phishing', 'DDoS saturation', 'ARP flooding'], answer: 'Wireless jamming or interference', explanation: 'Radio interference can disrupt service even without a fake login screen.' },
      { prompt: 'A student’s infected laptop can communicate directly with payroll servers and admin workstations. Which weakness is most likely?', options: ['Flat network design and poor segmentation', 'Weak password hashing', 'No MFA', 'Too much DNS caching'], answer: 'Flat network design and poor segmentation', explanation: 'When systems are not segmented, an infected host can move laterally more easily.' },
      { prompt: 'An ACL denies all traffic from a department subnet and then later allows HTTPS to an approved server. Why does HTTPS fail?', options: ['The first matching rule applies before the allow', 'The server is offline', 'The NIC is disabled', 'The packet is encrypted'], answer: 'The first matching rule applies before the allow', explanation: 'ACLs are processed in order, and the first match wins.' },
      { prompt: 'A firewall allows port 443 from the server subnet to the internet, but inbound client connections still fail. What should be checked?', options: ['Traffic direction, interface, and rule order', 'Whether the keyboard is used', 'Whether the site uses HTTPS', 'The number of users connected'], answer: 'Traffic direction, interface, and rule order', explanation: 'A rule may allow outbound traffic but not the needed inbound path.' },
      { prompt: 'A router ACL allows HTTPS from a subnet to a server but denies SSH from the same subnet. What is the expected result?', options: ['HTTPS works and SSH fails', 'SSH works and HTTPS fails', 'Both work', 'Neither works'], answer: 'HTTPS works and SSH fails', explanation: 'The access control policy explicitly permits HTTPS and denies SSH.' },
      { prompt: 'Remote users need access to one internal application, but their VPN places them on the same unrestricted network as administrators. What principle is violated?', options: ['Least privilege and segmentation', 'Hashing', 'Certificate validation', 'Rate limiting'], answer: 'Least privilege and segmentation', explanation: 'The VPN grants broader network access than necessary, creating more attack paths.' },
      { prompt: 'A NIDS reports unusual traffic from a lab computer. Why should the team avoid assuming malicious intent immediately?', options: ['Anomaly detection can produce false positives', 'Only brute force creates anomalies', 'Locks always indicate attacks', 'ARP maps are always malicious'], answer: 'Anomaly detection can produce false positives', explanation: 'Normal approved activity and false positives can trigger alerts without any actual attack.' },
      { prompt: 'Authentication logs show many failed logins to several accounts followed by one success from an unfamiliar host. What should be investigated?', options: ['Possible password spraying followed by account compromise', 'Only the user’s browser type', 'Only the time zone', 'Only DNS records'], answer: 'Possible password spraying followed by account compromise', explanation: 'The pattern suggests a distributed guess against many accounts, followed by one successful access.' },
      { prompt: 'Monitoring detects an ARP change immediately after IT replaces a router. Should it be automatically labeled as an attack?', options: ['No; it could be legitimate maintenance', 'Yes; any ARP change is poisoning', 'No; all DNS changes are harmless', 'Yes; only the switch logs matter'], answer: 'No; it could be legitimate maintenance', explanation: 'A legitimate network change can update ARP mappings without malicious intent.' },
      { prompt: 'A user reports a redirected web page at 10:05, while logs show a DNS change at 09:58 and ARP activity at 10:01. What’s the best interpretation?', options: ['It raises a concern for DNS or ARP manipulation, but does not prove cause', 'It proves a malicious attack definitely occurred', 'It proves the user caused the problem', 'It proves the firewall failed'], answer: 'It raises a concern for DNS or ARP manipulation, but does not prove cause', explanation: 'Timestamps and indicators suggest risk, but investigators still need corroborating evidence.' }
    ],
    'unit-4': [
      { prompt: 'A login service logs hundreds of password guesses against one employee account in a short time. What attack is this?', options: ['Brute-force attack', 'Smishing', 'Threat modeling', 'MAC flooding'], answer: 'Brute-force attack', explanation: 'The attacker is trying many passwords against the same account.' },
      { prompt: 'Logs show one common password tried once against hundreds of staff accounts. What pattern is this?', options: ['Password spraying', 'Whaling', 'SQL injection', 'Jamming'], answer: 'Password spraying', explanation: 'Attackers use a small set of common guesses across many accounts to avoid per-account lockouts.' },
      { prompt: 'A password from a public gaming site breach works on a school account. What technique is this?', options: ['Credential stuffing', 'Tailgating', 'ARP spoofing', 'Directory traversal'], answer: 'Credential stuffing', explanation: 'Attackers replay known user/password pairs across other services.' },
      { prompt: 'A stolen password database contains values that attackers quickly recover with precomputed tables. What weakness likely exists?', options: ['Fast unsalted hashing', 'No firewall', 'No port security', 'Too much DNS filtering'], answer: 'Fast unsalted hashing', explanation: 'Weak password storage makes precomputed lookup attack feasible.' },
      { prompt: 'A device asks for a password and then a second secret question answer. Is this MFA?', options: ['No, both are knowledge factors', 'Yes, it is a strong form of MFA', 'No, because the device is secure', 'Yes, because both are secret'], answer: 'No, both are knowledge factors', explanation: 'Two knowledge factors are not two different factor categories.' },
      { prompt: 'A caller claiming to be IT knows an employee’s name and asks them to read an authenticator code. What is the danger?', options: ['Vishing or pretexting to complete authentication', 'A rogue DHCP problem', 'A weak firewall rule', 'A social media scam'], answer: 'Vishing or pretexting to complete authentication', explanation: 'The attacker wants the employee to reveal a one-time code that grants access.' },
      { prompt: 'An employee signs in successfully but cannot open the payroll folder. What is the most likely issue?', options: ['Authorization, not authentication', 'A DNS spoof', 'A network jamming attack', 'A BIOS issue'], answer: 'Authorization, not authentication', explanation: 'The identity was verified, but the system refused the requested action based on the user’s permissions.' },
      { prompt: 'Every student laptop user can install software and disable the firewall. What are the core weaknesses?', options: ['Excessive privilege and weak endpoint controls', 'A weak DNS filter', 'No ACLs', 'A missing VLAN'], answer: 'Excessive privilege and weak endpoint controls', explanation: 'When users have wider-than-needed rights, they can disable protections and install risky software.' },
      { prompt: 'Endpoint protection reports no known malware signature, but an unknown process starts contacting an external server and changing startup settings. Why can signature-only detection miss this?', options: ['New or modified malware may not match any known signature', 'Signatures never detect malware', 'The process is always harmless', 'Only firewall tools work'], answer: 'New or modified malware may not match any known signature', explanation: 'Behavior-based detection and logging help catch suspicious actions that do not match known patterns.' },
      { prompt: 'An old laptop running an internet-facing service has a known update available, but the owner says it still works. Why is this risky?', options: ['Known vulnerabilities remain exploitable even if the service still works', 'Older systems are always secure', 'Updates always break services', 'Only cloud systems need patches'], answer: 'Known vulnerabilities remain exploitable even if the service still works', explanation: '“It still works” does not mean it is not exposed to exploitation.' },
      { prompt: 'A device shows repeated failed logins, a successful login, creation of a new admin account, and an outbound connection. Which events are important?', options: ['The login, new admin account, and outbound connection are indicators of compromise', 'Only the outbound connection matters', 'Only the failed logins matter', 'None are suspicious'], answer: 'The login, new admin account, and outbound connection are indicators of compromise', explanation: 'This sequence can show unauthorized access followed by persistence and exfiltration activity.' },
      { prompt: 'An authentication log lists a successful login from a shared school network IP. Can that alone identify the user?', options: ['No, shared IPs can belong to many users or devices', 'Yes, from the IP alone', 'No, because the IP is always static', 'Yes, because all logins are unique'], answer: 'No, shared IPs can belong to many users or devices', explanation: 'A shared address does not name the specific device or user without more correlation.' },
      { prompt: 'A staff laptop has a new admin account the owner does not recognize. Does that mean there is no incident?', options: ['No, an unexpected admin account is a serious indicator even before data access', 'Yes, because no files were touched', 'Yes, because the owner can still log in', 'No, because the account is only a harmless test'], answer: 'No, an unexpected admin account is a serious indicator even before data access', explanation: 'Unauthorized privileged access is dangerous because it creates future access and persistence.' }
    ],
    'unit-5': [
      { prompt: 'A web form accepts a search value that includes database commands. What vulnerability is present?', options: ['SQL injection', 'ARP spoofing', 'MAC flooding', 'Smishing'], answer: 'SQL injection', explanation: 'User input is being directly combined into a database query without safe handling.' },
      { prompt: 'A user posts a comment containing script-like content and other users receive a fake sign-in prompt. What vulnerability is this?', options: ['Cross-site scripting (XSS)', 'Tailgating', 'Rogue AP', 'Piggybacking'], answer: 'Cross-site scripting (XSS)', explanation: 'Untrusted content is executed in the browser of other users.' },
      { prompt: 'A download endpoint accepts a filename containing path-navigation characters and retrieves a configuration file outside the public folder. What is the problem?', options: ['Directory traversal', 'Credential stuffing', 'Password spraying', 'Vishing'], answer: 'Directory traversal', explanation: 'The path escapes the expected folder and reaches unauthorized files.' },
      { prompt: 'An application crashes when a specially large input is submitted. What vulnerability is this most likely to be?', options: ['Buffer overflow or overread', 'ARP poisoning', 'Rogue DHCP', 'Piggybacking'], answer: 'Buffer overflow or overread', explanation: 'Unsafe memory handling can crash a service or lead to code execution.' },
      { prompt: 'A service sends confidential student information over an unencrypted connection on public Wi-Fi. Which CIA goals are most threatened?', options: ['Confidentiality and integrity', 'Only availability', 'Only authenticity', 'Only detection'], answer: 'Confidentiality and integrity', explanation: 'An attacker can observe or modify data in transit without protection.' },
      { prompt: 'A school application labels a file as “internal,” but every logged-in user can view highly sensitive health information. What failed?', options: ['Classification and authorization', 'Physical security', 'Port filtering', 'Wireless jamming'], answer: 'Classification and authorization', explanation: 'The data was not protected by the correct access model even though it was labeled internally.' },
      { prompt: 'An application has the same database permissions as a system administrator. What design weakness is this?', options: ['Excessive privilege and poor separation of duties', 'Weak DNS', 'No encryption', 'Poor camera placement'], answer: 'Excessive privilege and poor separation of duties', explanation: 'Granting an app broad rights makes a flaw more damaging.' },
      { prompt: 'A developer wants to store user passwords so they can be recovered if a user forgets one. What is the correct cryptographic approach?', options: ['Use a slow password-hashing function with a salt and reset forgotten passwords instead of recovering them', 'Store plaintext in the database', 'Use a fast hash without salt', 'Encrypt the password with the same key as the app'], answer: 'Use a slow password-hashing function with a salt and reset forgotten passwords instead of recovering them', explanation: 'Passwords should be hashed and non-recoverable to reduce offline attack risk.' },
      { prompt: 'A service encrypts every record with one symmetric key stored in the same public app directory as the encrypted files. What is the main weakness?', options: ['Key management and storage', 'The cipher is too slow', 'The app is too small', 'The logs are unreadable'], answer: 'Key management and storage', explanation: 'If an attacker gains the directory, they may obtain both the data and the key.' },
      { prompt: 'A user encrypts a secret report with a public key found in an unsolicited email. What is the risk?', options: ['The public key may belong to an attacker and the private key should never be shared', 'The email is always trusted', 'The report is automatically secure', 'Public keys are secret'], answer: 'The public key may belong to an attacker and the private key should never be shared', explanation: 'Encryption in the wrong key means the wrong party can read the message.' },
      { prompt: 'A vendor encrypts a message with the recipient’s public key and signs it with the vendor’s private key. Which action supports confidentiality?', options: ['Encrypting with the recipient’s public key', 'Signing with the private key alone', 'Using a weak password', 'Adding a text message'], answer: 'Encrypting with the recipient’s public key', explanation: 'Only the matching private key can decrypt the message, protecting confidentiality.' },
      { prompt: 'A newly installed application exposes its admin console to the internet and uses a default password. What principle is violated?', options: ['Secure by default', 'Only password policy', 'Only log review', 'Only backup recovery'], answer: 'Secure by default', explanation: 'Services should ship with secure settings and strong defaults, not exposed admin interfaces and default credentials.' },
      { prompt: 'A file with a fake account number is placed in a restricted directory. A monitoring alert fires when it is accessed by an unfamiliar service account. What detection technique is this?', options: ['A honeytoken', 'A password spray', 'A DNS cache', 'A MAC flood'], answer: 'A honeytoken', explanation: 'A decoy value signals unauthorized access when used unexpectedly.' },
      { prompt: 'File-integrity monitoring detects hundreds of sensitive records changing at 02:00, outside the normal update window. What could this signal?', options: ['Unauthorized change or a legitimate maintenance window that needs verification', 'Always a harmless file copy', 'Always a DNS issue', 'Always a physical door issue'], answer: 'Unauthorized change or a legitimate maintenance window that needs verification', explanation: 'The alert is meaningful, but context is needed to distinguish compromise from approved changes.' },
      { prompt: 'An employee account downloads thousands of records at midnight from a new location. Which indicators are most concerning?', options: ['Unusual time, location, and volume', 'The browser version', 'The screen size', 'The department name'], answer: 'Unusual time, location, and volume', explanation: 'A large, off-hours, unusual-location download is a common sign of misuse or compromise.' },
      { prompt: 'An internal decoy server receives repeated connection attempts from a workstation. What does this tell the analyst?', options: ['The source may be scanning or misdirected, but it does not alone prove a compromise', 'It proves the workstation is definitely malicious', 'It proves the firewall is down', 'It proves the user stole credentials'], answer: 'The source may be scanning or misdirected, but it does not alone prove a compromise', explanation: 'A honeypot signal is suspicious but still requires corroborating evidence.' },
      { prompt: 'A system outage occurs and the latest backup cannot be decrypted because the encryption key was lost. Which security goal is affected?', options: ['Availability and recovery assurance', 'Only confidentiality', 'Only the wireless AP name', 'Only authentication'], answer: 'Availability and recovery assurance', explanation: 'If backups cannot be restored, the organization loses both availability and recovery confidence.' }
    ]
  };

  function shuffle(list) {
    const array = [...list];
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function getRandomQuestionsForUnit(unitNumber) {
    const targetUnit = Number(unitNumber) || 1;
    const selected = [];

    for (let currentUnit = 1; currentUnit <= targetUnit; currentUnit += 1) {
      const bank = reviewBanks[`unit-${currentUnit}`] || [];
      const count = currentUnit === targetUnit ? 10 : 5;
      const sample = shuffle(bank).slice(0, Math.min(count, bank.length));
      selected.push(...sample);
    }

    return shuffle(selected).slice(0, 10 + (targetUnit - 1) * 5);
  }

  function renderReviewSet(set) {
    const mount = document.getElementById('review-root');
    if (!mount || !set || !Array.isArray(set.questions)) {
      return;
    }

    mount.innerHTML = set.questions.map((question, index) => {
      const optionsMarkup = question.options.map((option) => `
        <button class="option-button" type="button" data-answer="${option}">${option}</button>
      `).join('');

      return `
        <article class="quiz-card" data-correct="${question.answer}">
          <h3>${index + 1}. ${question.prompt}</h3>
          <div class="choice-row">${optionsMarkup}</div>
          <div class="answer-box" hidden>
            <strong>Answer:</strong> ${question.answer}<br>
            <span>${question.explanation}</span>
          </div>
        </article>
      `;
    }).join('');

    const cards = mount.querySelectorAll('.quiz-card');
    cards.forEach((card) => {
      const correctValue = card.dataset.correct;
      const buttons = card.querySelectorAll('.option-button');
      const answerBox = card.querySelector('.answer-box');

      buttons.forEach((button) => {
        button.addEventListener('click', () => {
          const selected = button.dataset.answer;

          buttons.forEach((btn) => {
            btn.classList.remove('selected', 'correct', 'incorrect');
            if (btn.dataset.answer === correctValue) {
              btn.classList.add('correct');
            }
          });

          button.classList.add('selected');
          if (selected === correctValue) {
            button.classList.add('correct');
          } else {
            button.classList.add('incorrect');
          }

          if (answerBox) {
            answerBox.hidden = false;
          }

          buttons.forEach((btn) => {
            btn.disabled = true;
          });

          const allCards = Array.from(document.querySelectorAll('.quiz-card'));
          const score = allCards.filter((item) => 
            item.querySelector('.option-button.correct.selected') !== null
          ).length;

          const scoreBox = document.getElementById('score-box');
          if (scoreBox) {
            scoreBox.textContent = `Score: ${score} / ${allCards.length}`;
          }
        });
      });
    });

    const scoreBox = document.getElementById('score-box');
    if (scoreBox) {
      scoreBox.textContent = `Score: 0 / ${cards.length}`;
    }
  }

  function renderUnitReview(unitNumber) {
    const questionCount = 10 + (Number(unitNumber) - 1) * 5;
    const questions = getRandomQuestionsForUnit(unitNumber);
    renderReviewSet({ title: `Unit ${unitNumber} review`, questions: questions.slice(0, Math.min(questionCount, questions.length)) });
  }

  window.reviewBanks = reviewBanks;
  window.renderReviewSet = renderReviewSet;
  window.getRandomQuestionsForUnit = getRandomQuestionsForUnit;
  window.renderUnitReview = renderUnitReview;
})();
