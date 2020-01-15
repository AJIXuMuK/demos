// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
//
// Generated with Bot Builder V4 SDK Template for Visual Studio EchoBot v4.6.2

using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Schema;
using SPListBot.Extensions;

namespace SPListBot.Bots
{
	public class EchoBot<T> : ActivityHandler where T : Dialog
	{
		protected readonly ConversationState ConversationState;
		protected readonly Dialog Dialog;
		protected readonly UserState UserState;

		public EchoBot(ConversationState conversationState, UserState userState, T dialog)
		{
			this.ConversationState = conversationState;
			this.UserState = userState;
			this.Dialog = dialog;
		}

		public override async Task OnTurnAsync(ITurnContext turnContext, CancellationToken cancellationToken = default(CancellationToken))
		{
			await base.OnTurnAsync(turnContext, cancellationToken);

			// Save any state changes that might have occurred during the turn.
			await ConversationState.SaveChangesAsync(turnContext, false, cancellationToken);
			await UserState.SaveChangesAsync(turnContext, false, cancellationToken);
		}

		protected override async Task OnMessageActivityAsync(ITurnContext<IMessageActivity> turnContext, CancellationToken cancellationToken)
		{
			// Run the Dialog with the new message Activity.
			await Dialog.Run(turnContext, ConversationState.CreateProperty<DialogState>(nameof(DialogState)), cancellationToken);
		}

		protected override async Task OnTokenResponseEventAsync(ITurnContext<IEventActivity> turnContext, CancellationToken cancellationToken)
		{
			// Run the Dialog with the new Token Response Event Activity.
			await Dialog.Run(turnContext, ConversationState.CreateProperty<DialogState>(nameof(DialogState)), cancellationToken);
		}

		protected override async Task OnMembersAddedAsync(IList<ChannelAccount> membersAdded, ITurnContext<IConversationUpdateActivity> turnContext, CancellationToken cancellationToken)
		{
			foreach (var member in membersAdded)
			{
				if (member.Id != turnContext.Activity.Recipient.Id)
				{
					await turnContext.SendActivityAsync(CreateActivityWithTextAndSpeak($"Hello and welcome!"), cancellationToken);
				}
			}
		}

		private IActivity CreateActivityWithTextAndSpeak(string message)
		{
			var activity = MessageFactory.Text(message);
			string speak = @"<speak version='1.0' xmlns='https://www.w3.org/2001/10/synthesis' xml:lang='en-US'>
              <voice name='Microsoft Server Speech Text to Speech Voice (en-US, JessaRUS)'>" +
			  $"{message}" + "</voice></speak>";
			activity.Speak = speak;
			return activity;
		}
	}
}
