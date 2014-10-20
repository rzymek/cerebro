Reports = new Mongo.Collection('reports');
Senders = new Mongo.Collection('senders', {
    transform: function(doc){
        doc.display = function() {
            return doc.name || doc._id;
        }
        return doc;
    }
});