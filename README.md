# webpage

Marketing Webpage

gh-pages branch is attached to github pages to deploy webpage.
The source code resides in main. View it like prod.

To deploy to gh-pages branch:

git checkout main
npm run build
npm run deploy

The deploy (in package.json) is set to deploy into gh-pages branch.
On the github UI, that branch is selected to trigger the pages. As mentioned.

Admins can supply the URL.

To press the domain owned by VolIoT:
The domain is owned by VolIoT's AWS marketing accout.
In there, Route 53 forwards the DNS to the GitHub DNS. For easy URL transition by they user.
