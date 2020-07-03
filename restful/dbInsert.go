package main

import (
	"strconv"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func insertNewTxt() {
	// Mongodb insert one

	userName := "tester"
	txtName := "Test Data"
	txtPath := "/data/Test Data.txt"

	data := readTxt(txtPath)     // txt 파일 읽기
	splitedArr := splitTxt(data) // 300줄씩 부분으로 나누기

	// 모든 부분을 역순으로 insert하며 다음 부분에 _id 입력
	// 마지막 부분(즉 처음으로 insert할 부분)은 다음 부분이 없으므로 ObjectID(0000...) 입력
	nextTxtID := primitive.ObjectID{0} // 다음 부분의 _id
	maxIndex := len(splitedArr)
	for i := maxIndex - 1; i >= 0; i-- {
		insertResult, err := collection["txt_content"].InsertOne(ctx, bson.M{
			"title":   txtName + " - " + strconv.Itoa(i+1) + " / " + strconv.Itoa(maxIndex),
			"content": splitedArr[i],
			"nextID":  nextTxtID,
		})
		errCheck(err)
		nextTxtID = insertResult.InsertedID.(primitive.ObjectID)
	}

	insertStartID(userName, txtName, nextTxtID) // username에 따라 startID 추가
}

func insertStartID(userName, txtName string, startID primitive.ObjectID) {
	// Mongodb insert one

	userID := findUserIDByUserName(userName)
	_, err := collection["start_id"].InsertOne(ctx, bson.M{"user_id": userID, "txt_title": txtName, "txt_id": startID})
	errCheck(err)
}

func insertUser(userName string) {
	// Mongodb insert one

	_, err := collection["user"].InsertOne(ctx, bson.M{"user_name": userName})
	errCheck(err)
}
