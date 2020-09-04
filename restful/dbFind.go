package main

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// TODO : bson 추가해서 바로 넣기
type content struct {
	ID      string `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
	PrevID  string `json:"prevID"`
	NextID  string `json:"nextID"`
}

type userStruct struct {
	ID           string `json:"id" bson:"_id"`
	UserName     string `json:"user_name" bson:"user_name"`
	FirebaseUUID string `json:"firebase_uuid" bson:"firebase_uuid"`
}

type startIDStruct struct {
	ID       string `json:"id" bson:"_id"`
	TxtID    string `json:"txt_id" bson:"txt_id"`
	TxtTitle string `json:"txt_title" bson:"txt_title"`
	UserID   string `json:"user_id" bson:"user_id"`
}

/* ******************** Start : Find ******************** */

// findUserIDByFirebaseUUID : MongoDB find user_id by firebase_uuid
func findUserIDByFirebaseUUID(firebaseUUID string) primitive.ObjectID {
	var result bson.M // _id, user_name, firebase_uuid
	err := collection["user"].FindOne(ctx,
		bson.M{
			"firebase_uuid": firebaseUUID,
		}).Decode(&result)
	errCheck(err)

	return result["_id"].(primitive.ObjectID)
}

// findUserIDByUserName : MongoDB find user_id by user_name (deprecated)
func findUserIDByUserName(userName string) primitive.ObjectID {
	// Mongodb find
	var result bson.M // _id, user_name, firebase_uuid
	err := collection["user"].FindOne(ctx,
		bson.M{
			"user_name": userName,
		}).Decode(&result)
	errCheck(err)

	return result["_id"].(primitive.ObjectID)
}

// findAllStartIDByUserID : MongoDB find all start_ids by user_id
func findAllStartIDByUserID(userID primitive.ObjectID) []bson.M {
	cur, err := collection["start_id"].Find(ctx,
		bson.M{
			"user_id": userID,
		})
	errCheck(err)
	defer cur.Close(ctx)

	var resultArr []bson.M

	for cur.Next(ctx) {
		// get data from MongoDB cursor
		var result bson.M // _id, user_id, txt_id
		err := cur.Decode(&result)
		errCheck(err)
		resultArr = append(resultArr, result)
	}

	// check after find everything
	err = cur.Err()
	errCheck(err)

	return resultArr
}

// findContentByTxtID : MongoDB find txt_content by txt_id
func findContentByTxtID(txtObjectID primitive.ObjectID) (txtTitle, txtContent string, prevID primitive.ObjectID, nextID primitive.ObjectID) {
	var result bson.M // _id, title, content, prevID, nextID
	err := collection["txt_content"].FindOne(ctx,
		bson.M{
			"_id": txtObjectID,
		}).Decode(&result)
	errCheck(err)

	txtTitle = result["title"].(string)
	txtContent = result["content"].(string)
	prevID = result["prevID"].(primitive.ObjectID)
	nextID = result["nextID"].(primitive.ObjectID)
	return
}

/* ******************** End : Find ******************** */

/* ******************** Start : Get ******************** */

// getTxtContentByFirebaseUUID : get txt_content by firebase_uuid
func getTxtContentByFirebaseUUID(firebaseUUID string) (tContent content) {
	userID := findUserIDByFirebaseUUID(firebaseUUID)

	startIDArr := findAllStartIDByUserID(userID)
	// TODO : startID 중에서 가장 최근 기록을 고르는 프로세스가 추가로 들어가야함
	selectedIndex := len(startIDArr) - 1
	startID := startIDArr[selectedIndex]["txt_id"].(primitive.ObjectID)
	txtTitle, txtContent, prevID, nextID := findContentByTxtID(startID)
	tContent = content{
		ID:      startID.Hex(),
		Title:   txtTitle,
		Content: txtContent,
		PrevID:  prevID.Hex(),
		NextID:  nextID.Hex(),
	}
	return
}

// getAllStartIDByFirebaseUUID : get all start_ids by firebase_uuid
func getAllStartIDByFirebaseUUID(firebaseUUID string) (startIDArr []startIDStruct) {
	userObjectID := findUserIDByFirebaseUUID(firebaseUUID)

	// Mongodb find
	var startIDResult startIDStruct // _id, txt_id, txt_title, user_id

	cur, err := collection["start_id"].Find(ctx,
		bson.M{
			"user_id": userObjectID,
		})
	errCheck(err)

	for cur.Next(context.TODO()) {
		err := cur.Decode(&startIDResult)
		errCheck(err)

		// 추가
		startIDArr = append(startIDArr, startIDResult)
	}

	err = cur.Err()
	errCheck(err)

	cur.Close(context.TODO())

	return
}

// getTxtContentByTxtID : get txt_content by txt_id
func getTxtContentByTxtID(txtID string) (tContent content) {
	txtObjectID, err := primitive.ObjectIDFromHex(txtID)
	errCheck(err)

	txtTitle, txtContent, prevID, nextID := findContentByTxtID(txtObjectID)
	tContent = content{
		ID:      txtObjectID.Hex(),
		Title:   txtTitle,
		Content: txtContent,
		PrevID:  prevID.Hex(),
		NextID:  nextID.Hex(),
	}
	return
}

// getAllUserList : get all users (private)
func getAllUserList() (userArr []userStruct) {
	var userResult userStruct // _id, user_name, firebase_uuid

	cur, err := collection["user"].Find(ctx, bson.M{})
	errCheck(err)

	for cur.Next(context.TODO()) {
		err := cur.Decode(&userResult)
		errCheck(err)

		// 추가
		userArr = append(userArr, userResult)
	}

	err = cur.Err()
	errCheck(err)

	cur.Close(context.TODO())

	return
}

/* ******************** End : Get ******************** */
