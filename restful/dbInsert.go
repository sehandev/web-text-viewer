package main

import (
	"strconv"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// insertUser : insert new user
func insertUser(userName string) {
	_, err := collection["user"].InsertOne(ctx,
		bson.M{
			"user_name": userName,
		})
	errCheck(err)
}

// insertStartID : insert new start_id
func insertStartID(userName, txtName string, startID primitive.ObjectID) {
	userID := findUserIDByUserName(userName)
	_, err := collection["start_id"].InsertOne(ctx,
		bson.M{
			"user_id":   userID,
			"txt_title": txtName,
			"txt_id":    startID,
		})
	errCheck(err)
}

// insertTxtContent : insert new txt_content
func insertTxtContent() {

	// TODO : 입력 받아서 넣기
	userName := "tester"
	txtName := "Test"
	txtPath := "/data/test_copy.txt"

	data := readTxt(txtPath)     // txt 파일 읽기
	splitedArr := splitTxt(data) // 300줄씩 부분으로 나누기

	// 모든 부분을 역순으로 insert하며 다음 부분에 _id 입력
	// 마지막 부분(즉 처음으로 insert할 부분)은 다음 부분이 없으므로 ObjectID(0000...) 입력
	prevTxtID := primitive.ObjectID{0} // 이전 부분의 _id
	nextTxtID := primitive.ObjectID{0} // 다음 부분의 _id
	maxIndex := len(splitedArr)
	for i := maxIndex - 1; i >= 0; i-- {
		insertResult, err := collection["txt_content"].InsertOne(ctx,
			bson.M{
				"title":   txtName + " - " + strconv.Itoa(i+1) + " / " + strconv.Itoa(maxIndex),
				"content": splitedArr[i],
				"prevID":  prevTxtID,
				"nextID":  nextTxtID,
			})
		errCheck(err)
		nextTxtID = insertResult.InsertedID.(primitive.ObjectID)
	}

	insertStartID(userName, txtName, nextTxtID) // username에 따라 startID 추가

	prevTxtID = primitive.ObjectID{0} // 초기화
	// 마지막 부분 ObjectID(0000...) 또는 max index 조건
	// 현재 부분의 _id 저장해뒀다가 다음 부분에 추가하기
	for i := 0; (nextTxtID != primitive.ObjectID{0}) || (i < maxIndex); i++ {
		var findResult bson.M
		err := collection["txt_content"].FindOne(ctx,
			bson.M{
				"_id": nextTxtID,
			}).Decode(&findResult)
		_, err = collection["txt_content"].UpdateOne(ctx,
			bson.M{
				"_id": nextTxtID,
			},
			bson.M{
				"$set": bson.M{
					"prevID": prevTxtID,
				}})
		errCheck(err)
		prevTxtID = nextTxtID
		nextTxtID = findResult["nextID"].(primitive.ObjectID)
	}
}
