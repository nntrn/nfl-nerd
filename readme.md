# nfl nerd

This project:

* Fetches api data from ESPN
  * play by plays
  * consensus
  * h2h
  * win probabilities
* Creates a markdown file for comparing teams
* Update webpage for pivoting data

## CLI

```sh
# Create markdown with stats
bin/teams-markdown --teams WSH PHI

# Update and commit roster changes ./data/roster
bin/roster

# Create csv with all play by plays
bin/plays
```