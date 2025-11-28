package main

//
// import (
// 	"log"
// 	"os"
//
// 	"google.golang.org/protobuf/proto"
//
// 	"proxy/proxy/proxy-pb/" // update with your import path
// )
//
// func main() {
// 	// Build your protobuf request
// 	req := &pb.MyRequest{
// 		Id:   123,
// 		Name: "Alice",
// 	}
//
// 	// Serialize to binary
// 	data, err := proto.Marshal(req)
// 	if err != nil {
// 		log.Fatalf("Failed to marshal: %v", err)
// 	}
//
// 	// Save to file
// 	err = os.WriteFile("request.bin", data, 0o644)
// 	if err != nil {
// 		log.Fatalf("Failed to write file: %v", err)
// 	}
//
// 	log.Println("Wrote request.bin")
// }
