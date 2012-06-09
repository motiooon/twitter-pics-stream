
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Search Images on Twitter in Real Time' })
};