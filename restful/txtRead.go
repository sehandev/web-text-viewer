package main

import (
	"io/ioutil"
	"os"
	"path/filepath"
)

// txtPath example : /data/test.txt
func readTxt(txtPath string) (data []byte) {

	// txtPath : txt 파일 경로
	ex, err := os.Executable()
	errCheck(err)
	exPath := filepath.Dir(ex)
	txtPath = exPath + txtPath

	// data : txt 파일 전체 데이터
	data, err = ioutil.ReadFile(txtPath)
	errCheck(err)

	return
}

func splitTxt(data []byte) (txtSplitedArr []string) {

	txtData := string(data) + "\n -- TXT 파일 끝 --"

	cnt := 0
	splitIndexArr := []int{0} // 파일 분리할 index를 저장하는 slice
	for i, char := range txtData {
		if char == '\n' {
			cnt++

			// 300줄을 넘어가면 파일 분리하기 위해 index 저장
			if cnt > 300 {
				splitIndexArr = append(splitIndexArr, i)
				cnt = 0
			}
		}
	}

	// 0 ~ last-1까지 추가
	for i := 1; i < len(splitIndexArr); i++ {
		tmpSplited := txtData[splitIndexArr[i-1]:splitIndexArr[i]]
		txtSplitedArr = append(txtSplitedArr, tmpSplited)
	}

	// last 추가
	tmpSplited := txtData[splitIndexArr[len(splitIndexArr)-1]:]
	txtSplitedArr = append(txtSplitedArr, tmpSplited)

	return
}
