#### Summary of changes

**Asana Ticket:** [TICKET_NAME](TICKET_LINK)

[Please include a brief description of what was changed]

#### Reviewer Checklist

- [ ] Meets ticket's acceptance criteria
- [ ] Any new or changed functions have typespecs
- [ ] Tests were added for any new functionality (don't just rely on coverage statistics)
- [ ] Ask product if custom label updates in `mbta.ts` should also be made to `paess_labels.json` in Screenplay
- [ ] This branch was deployed to the staging environment and is currently running with no unexpected increase in warnings, and no errors or crashes (compare on Splunk: [staging](https://mbta.splunkcloud.com/en-US/app/search/search?q=search%20index%3Dsigns-ui-dev%20%22%5Berror%5D%22%20OR%20%22%5Bwarn%5D%22%20OR%20%22CRASH%22&display.page.search.mode=verbose&dispatch.sample_ratio=1&earliest=-4h%40m&latest=now&sid=1545840769.3874970) vs. [prod](https://mbta.splunkcloud.com/en-US/app/search/search?q=search%20index%3Dsigns-ui-prod%20%22%5Berror%5D%22%20OR%20%22%5Bwarn%5D%22%20OR%20%22CRASH%22&display.page.search.mode=verbose&dispatch.sample_ratio=1&earliest=-4h%40m&latest=now&sid=1545840745.3874956))
