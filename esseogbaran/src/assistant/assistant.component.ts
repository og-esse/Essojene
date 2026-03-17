import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface QuickAction {
  label: string;
  prompt: string;
}

@Component({
  selector: 'app-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assistant.component.html',
  styleUrls: ['./assistant.component.scss'],
})
export class AssistantComponent {
  input = '';
  loading = false;
  ticketCount = 1042;

  quickActions: QuickAction[] = [
    { label: 'VPN', prompt: 'I need help with my VPN connection.' },
    { label: 'Reset Password', prompt: 'I need to reset my password.' },
    { label: 'Wi-Fi', prompt: 'My Wi-Fi is not working.' },
    { label: 'MFA', prompt: 'I am having trouble with multi-factor authentication.' },
    { label: 'Who is Esse?', prompt: 'Who is Esse?' },
  ];

  messages: Message[] = [
    {
      role: 'assistant',
      content:
        'Hi, I’m your AI Support Assistant. How can I help you today? (Try: VPN issue, password reset)',
    },
  ];

  async sendMessage() {
    if (!this.input.trim() || this.loading) return;

    const userMessage = this.input;
    this.messages.push({ role: 'user', content: userMessage });
    this.input = '';
    this.loading = true;

    const response = await this.getAIResponse(userMessage).catch(() =>
      this.fakeAIResponse(userMessage)
    );

    this.messages.push({ role: 'assistant', content: response });
    this.loading = false;
  }

  async useQuickAction(prompt: string): Promise<void> {
    if (this.loading) return;

    this.input = prompt;
    await this.sendMessage();
  }

  escalateIssue(): void {
    const ticketId = `IT-${this.ticketCount++}`;

    this.messages.push({
      role: 'assistant',
      content: `I’ve escalated this issue to the support queue. Your ticket number is ${ticketId}. An IT specialist will follow up shortly.`,
    });
  }

  async getAIResponse(input: string): Promise<string> {
    const res = await fetch('http://localhost:3000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.reply || 'AI service request failed.');
    }

    return data.reply || 'No response from AI service.';
  }

  async fakeAIResponse(input: string): Promise<string> {
    const lower = input.toLowerCase();

    if (
      lower.includes('who is esse') ||
      lower.includes('who is esso') ||
      lower.includes('tell me about esse') ||
      lower.includes('who are you') ||
      lower.includes('about esse')
    ) {
      return `Esse is the engineer behind this portfolio.

Quick profile:
1. Frontend engineer with strong Angular, React, and TypeScript experience
2. Builds polished user experiences, design systems, and practical internal tools
3. Has enterprise experience at RBC and also ships creative side projects
4. Likes blending engineering, product thinking, and a bit of experimentation

Fun version:
Esse is basically equal parts builder, debugger, UI mechanic, and “let me automate that real quick” energy.`;
    }

    if (lower.includes('vpn') || lower.includes('remote access')) {
      return `It looks like you're having VPN issues.

Try the following:
1. Disconnect and reconnect to VPN
2. Restart your device
3. Ensure your network is set to "Private"
4. Confirm your VPN client is updated
5. Try a different home or mobile network if available

If the issue persists, use the Escalate Issue button and I’ll create a support ticket.`;
    }

    if (
      lower.includes('password') ||
      lower.includes('reset password') ||
      lower.includes('forgot password')
    ) {
      return `You can reset your password using the internal reset portal.

Steps:
1. Go to password reset page
2. Verify using OTP
3. Set a new password
4. Wait a few minutes, then sign in again on all devices

If you are locked out completely, use the Escalate Issue button and I’ll raise this to IT support.`;
    }

    if (
      lower.includes('wifi') ||
      lower.includes('wi-fi') ||
      lower.includes('internet') ||
      lower.includes('network')
    ) {
      return `It sounds like a network connectivity issue.

Try these checks:
1. Turn Wi-Fi off and back on
2. Forget the network and reconnect
3. Restart your router or hotspot
4. Confirm airplane mode is off
5. Test whether other sites or apps are also failing

If only company tools are affected, tell me which app is failing and I can narrow it down.`;
    }

    if (
      lower.includes('mfa') ||
      lower.includes('2fa') ||
      lower.includes('otp') ||
      lower.includes('authenticator') ||
      lower.includes('verification code')
    ) {
      return `This looks like a multi-factor authentication issue.

Try the following:
1. Check your phone time is set automatically
2. Open your authenticator app and refresh the code
3. Try the backup sign-in method if your company provides one
4. Request a new code and wait for the latest one only
5. Confirm you are signing into the correct work account

If you changed phones recently, you may need IT to re-register your MFA device.`;
    }

    if (
      lower.includes('locked out') ||
      lower.includes('account locked') ||
      lower.includes('cannot sign in') ||
      lower.includes("can't sign in") ||
      lower.includes('login issue')
    ) {
      return `It looks like you may be locked out of your account.

Recommended steps:
1. Confirm your username or work email is correct
2. Try password reset before making more sign-in attempts
3. Wait 10 to 15 minutes in case of a temporary lock
4. Clear saved credentials if your device keeps auto-filling old ones

If you still cannot access your account, use Escalate Issue so IT can unlock it.`;
    }

    if (
      lower.includes('email') ||
      lower.includes('outlook') ||
      lower.includes('mailbox')
    ) {
      return `It sounds like an email or Outlook issue.

Try this sequence:
1. Refresh the mailbox or restart Outlook
2. Check whether webmail works in the browser
3. Confirm your mailbox is not full
4. Remove and re-add the account only if IT policy allows it
5. Note any bounce-back or sync error message

If you share the exact error text, I can suggest the next step.`;
    }

    if (
      lower.includes('install') ||
      lower.includes('software') ||
      lower.includes('application') ||
      lower.includes('app not opening')
    ) {
      return `This sounds like a software install or launch problem.

Try the following:
1. Fully close and reopen the app
2. Restart your computer
3. Confirm you are on the company network or VPN if required
4. Check whether the app is approved in the company software portal
5. Capture any error code or screenshot

If this is a restricted install, IT may need to grant access or install it for you.`;
    }

    if (
      lower.includes('printer') ||
      lower.includes('print') ||
      lower.includes('scanner')
    ) {
      return `This looks like a printer or scanner issue.

Quick checks:
1. Make sure the correct printer is selected
2. Check paper, toner, and connection status
3. Remove stuck jobs from the print queue
4. Reconnect to the office network if the printer is shared
5. Try printing a simple test page

If only one printer is failing, tell me the printer name or location.`;
    }

    if (
      lower.includes('slow') ||
      lower.includes('freezing') ||
      lower.includes('lag') ||
      lower.includes('performance')
    ) {
      return `It sounds like a performance issue on your device.

Try this:
1. Restart the computer first
2. Close heavy apps or extra browser tabs
3. Check available disk space
4. Connect to power if battery saver is enabled
5. Note whether the slowness affects one app or the whole system

If the problem happens only in one app, tell me which one and what action triggers it.`;
    }

    return `I understand your request: "${input}".

Here are the details that would help me guide you faster:
1. What system or app is affected
2. What error message you see
3. Whether this started today or has been ongoing
4. Whether it affects only you or multiple people

You can also use a quick action above or escalate the issue if it is blocking your work.`;
  }
}
