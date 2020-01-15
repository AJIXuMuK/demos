using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Builder.Dialogs.Choices;
using Microsoft.Bot.Schema;
using Microsoft.Extensions.Configuration;
using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SPListBot.Dialogs
{
	public class MainDialog : ComponentDialog
	{
		/// <summary>
		/// List Id to work with
		/// </summary>
		private readonly string ListId = "7BEEAC4C-C897-4D1C-8FFA-E75ED541ACD5";
		/// <summary>
		/// Site Graph Id to work with
		/// </summary>
		private readonly string SiteId = "aterentiev.sharepoint.com,8589df16-2bb2-47ae-b935-b421e6c3ec8b,dcbb74db-3cec-47a9-a271-325a15b93034";

		public MainDialog(IConfiguration configuration)
		{
			//
			// OuathPrompt dialog for authentication
			//
			AddDialog(new OAuthPrompt(nameof(OAuthPrompt), new OAuthPromptSettings
			{
				ConnectionName = configuration["ConnectionName"],
				Text = "Our awesome oauth prompt",
				Title = "Plase sign in"
			}));

			// TextPrompt to ask for a name
			AddDialog(new TextPrompt(nameof(TextPrompt)));
			// NumberPrompt to ask for age
			AddDialog(new NumberPrompt<int>("NumberPrompt"));
			// ChoicePrompt to ask for gender
			AddDialog(new ChoicePrompt(nameof(ChoicePrompt)));

			//
			// Main waterfall dialog
			//
			AddDialog(new WaterfallDialog(nameof(WaterfallDialog), new List<WaterfallStep>
			{
				PromptStepAsync,			// Authentication step
				LoginStepAsync,				// processing auth access token step
				PromptNameStepAsync,		// name prompt step
				PromptAgeStepAsync,			// age prompt step
				PromptGenderStepAsync,		// gender prompt step
				SaveVisitorStepAsync		// saving results to the list step
			}));

			InitialDialogId = nameof(WaterfallDialog);
		}

		private async Task<DialogTurnResult> PromptStepAsync(WaterfallStepContext stepContext, CancellationToken cancellationToken)
		{
			return await stepContext.BeginDialogAsync(nameof(OAuthPrompt), null, cancellationToken);
		}

		private async Task<DialogTurnResult> LoginStepAsync(WaterfallStepContext stepContext, CancellationToken cancellationToken)
		{
			// Get the token from the previous step. Note that we could also have gotten the
			// token directly from the prompt itself. There is an example of this in the next method.
			var tokenResponse = (TokenResponse)stepContext.Result;
			if (tokenResponse != null)
			{
				// saving the token in the dialog state to use in future steps
				stepContext.Values["accessToken"] = tokenResponse.Token;
				return await stepContext.NextAsync();
			}
			else
			{
				await stepContext.Context.SendActivityAsync(MessageFactory.Text("Login was not successful please try again."), cancellationToken);
			}
			return await stepContext.EndDialogAsync();
		}

		private async Task<DialogTurnResult> PromptNameStepAsync(WaterfallStepContext stepContext, CancellationToken cancellationToken)
		{
			return await stepContext.BeginDialogAsync(nameof(TextPrompt), new PromptOptions
			{
				Prompt = MessageFactory.Text("Please, enter visitor's full name")
			}, cancellationToken);
		}

		private async Task<DialogTurnResult> PromptAgeStepAsync(WaterfallStepContext stepContext, CancellationToken cancellationToken)
		{
			string name = (string)stepContext.Result;
			stepContext.Values.Add("name", name);
			return await stepContext.BeginDialogAsync("NumberPrompt", new PromptOptions
			{
				Prompt = MessageFactory.Text("Please, enter visitor's age")
			}, cancellationToken);
		}

		private async Task<DialogTurnResult> PromptGenderStepAsync(WaterfallStepContext stepContext, CancellationToken cancellationToken)
		{
			var age = (int)stepContext.Result;
			stepContext.Values.Add("age", age);
			return await stepContext.BeginDialogAsync(nameof(ChoicePrompt), new PromptOptions
			{
				Choices = new List<Choice>
				{
					new Choice("Male"),
					new Choice("Female"),
					new Choice("Other"),
					new Choice("Won't say")
				}
			}, cancellationToken);
		}

		private async Task<DialogTurnResult> SaveVisitorStepAsync(WaterfallStepContext stepContext, CancellationToken cancellationToken)
		{
			var gender = (stepContext.Result as FoundChoice).Value;

			//
			// Creating GraphServiceClient from Graph SDK
			//
			var graphClient = new GraphServiceClient(
				new DelegateAuthenticationProvider( // we're using delegated permissions provider
					requestMessage =>
					{
						requestMessage.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("bearer", stepContext.Values["accessToken"].ToString());
						return Task.CompletedTask;
					}));

			//
			// creating an entity to be sent to Graph endpoint to create a new item
			//
			var listItem = new ListItem
			{
				Fields = new FieldValueSet
				{
					AdditionalData = new Dictionary<string, object>
					{
						{ "Title", stepContext.Values["name"] },
						{ "Age", stepContext.Values["age"] },
						{ "Gender", gender }
					}
				}
			};

			// adding new item
			await graphClient.Sites[SiteId].Lists[ListId].Items.Request().AddAsync(listItem);

			await stepContext.Context.SendActivityAsync(MessageFactory.Text("New visitor has been added"), cancellationToken);

			return await stepContext.EndDialogAsync();
		}
	}
}
