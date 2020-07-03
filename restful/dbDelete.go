package main

import (
	"go.mongodb.org/mongo-driver/bson"
)

// db.collection.remove({ "fieldName" : { $ne : "value"}})
func deleteTmp() {
	// Mongodb insert one
	// txtID, err := primitive.ObjectIDFromHex("5ef629786d4bd38fc106c601")
	// errCheck(err)
	_, err := collection["txt_content"].DeleteMany(ctx, bson.M{})
	errCheck(err)
	_, err = collection["start_id"].DeleteMany(ctx, bson.M{})
	errCheck(err)
}
