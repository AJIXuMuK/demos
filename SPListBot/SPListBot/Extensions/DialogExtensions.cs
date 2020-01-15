using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Dialogs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SPListBot.Extensions
{
	public static class DialogExtensions
	{
		/// <summary>
		/// Continues previous or starts new dialog
		/// </summary>
		/// <param name="dialog"></param>
		/// <param name="turnContext"></param>
		/// <param name="accessor"></param>
		/// <param name="cancellationToken"></param>
		/// <returns></returns>
		public static async Task Run(this Dialog dialog, ITurnContext turnContext, IStatePropertyAccessor<DialogState> accessor, CancellationToken cancellationToken = default(CancellationToken))
		{
			var dialogSet = new DialogSet(accessor);
			dialogSet.Add(dialog);

			var dialogContext = await dialogSet.CreateContextAsync(turnContext, cancellationToken);

			var results = await dialogContext.ContinueDialogAsync(cancellationToken);
			if (results.Status == DialogTurnStatus.Empty)
			{
				await dialogContext.BeginDialogAsync(dialog.Id, null, cancellationToken);
			}
		}
	}
}
