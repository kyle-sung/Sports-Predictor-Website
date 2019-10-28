
var overallRankingApp = new Vue({
    el: '#overall-ranking',
    data: {
        teams: [
            {
                avg_win_rate: 1,
                abbreviation: 'Loading...'
            },
            {
                avg_win_rate: 1,
                abbreviation: 'Loading...'
            },
            {
                avg_win_rate: 1,
                abbreviation: 'Loading...'
            },
        ],
    },
})

overallRankingApp.teams = Object.values(stats).sort(function(a, b) {
    return b.avg_win_rate - a.avg_win_rate;
}).map(function(team) {
    team.name = teamNames[team.abbreviation];
    return team;
});

var weeklyPredictionsApp = new Vue({
    el: '#weekly-predictions',
    data: {
        weeks: []
    }
})

getSchedule().then(function(weeks) {
    weeklyPredictionsApp.weeks = weeks;
});

function getSchedule() {
    var weeks = [];

	for (var i = 1; i <= 17; i ++) {
      weeks[i - 1] = fetch('http://www.nfl.com/ajax/scorestrip?season=2019&seasonType=REG&week=' + i).then(function(response) { //this leads to a scorestrip link to specific weeks, the i variable controls which week
      	return response.text()
      }).then(function(xml) {
         var data = xmlToJson(new DOMParser().parseFromString(xml, 'application/xml'));
         var games = data.ss.gms.g;
         return games.map(function(game) {
            var attrs = game['@attributes'];
            var eid = attrs.eid;
			var year = eid.substr(0, 4);
            var month = eid.substr(4, 2);
            var day = eid.substr(6, 2);
            console.log(attrs.h, stats[attrs.h])
            var home = attrs.h;
            var away = attrs.v;
            if (home === 'LAC')
                home = 'SD';
            else if(away == 'LAC')
                away = 'SD';
			return {
				date: new Date(year, month - 1, day),
				home: home,
                away: attrs.v,
                homeWinRate: stats[home].avg_win_rate,
                awayWinRate: stats[away].avg_win_rate,
            }
         }).filter(function(game) {
             return game.home && game.away;
         })
      })
    }

    return Promise.all(weeks);
}

function getStats() {
    return fetch('database/stats.json').then(function(response) {
        return response.json()
    });
}

