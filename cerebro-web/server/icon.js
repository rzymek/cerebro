
WebApp.connectHandlers
        .use("/icon.svg", Meteor.bindEnvironment(function(req, res) {
            try {
                check(req.query, {
                    color: String,
                    text: String,
                    border: String
                });
                var color = req.query.color;
                var text = req.query.text;
                var border = req.query.border;
                res.writeHead(200, {'Content-Type': 'image/svg+xml'});
                var svg = Assets.getText('icon.svg');
                svg = svg.replace('{{color}}', color);
                svg = svg.replace('{{border}}', border);
                svg = svg.replace('{{text}}', text);
                res.write(svg);
            } catch (e) {
                res.writeHead(500);
                res.write('ERROR: ' + e.message);
                throw e;
            } finally {
                res.end();
            }
        }));

