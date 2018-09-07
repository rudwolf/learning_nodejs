function NewsDAO(conn) {
    this._conn = conn;
}

NewsDAO.prototype.getAll = function( callback){
    sqlQry = 'select * from news ORDER BY published_at DESC';
    this._conn.query(sqlQry, callback);
};

NewsDAO.prototype.getLastNews = function( callback){
    sqlQry = 'select * from news ORDER BY published_at DESC LIMIT 5';
    this._conn.query(sqlQry, callback);
};

NewsDAO.prototype.getSingle = function(news_id, callback){
    sqlQry = 'select * from news where id = '+news_id;
    this._conn.query(sqlQry, callback);
};

NewsDAO.prototype.save = function(news_body, callback){
    //console.log(news_body);
    this._conn.query('insert into news set ?', news_body, callback);
};

module.exports = function(app) {
    return NewsDAO;    
};