# from __future__ import division
import nflgame #main api to retrieve stats (2009-2016)
import json

starting_year = 2009
ending_year = 2016
teams = {}

for year in range(starting_year, ending_year + 1):
    print('Compiling stats for year ' + str(year))
    for game in nflgame.games(year):
        home = game.home
        score_away = game.score_away
        score_home = game.score_home

        if home not in teams:
            teams[home] = {
                'abbreviation': home,
                'num_wins': 0,
                'num_losses': 0
            }

        if score_home > score_away:
            teams[home]['num_wins'] += 1
        elif score_home < score_away:
            teams[home]['num_losses'] += 1

for team_name in teams:
    team = teams[team_name]
    team['avg_win_rate'] = team['num_wins'] / (team['num_wins'] + team['num_losses'])

#dump parsed stats to stats.json as javascript objects
with open('stats.json', 'w') as f:
    json.dump(teams, f)