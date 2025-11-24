package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"cloud.google.com/go/pubsub/v2"
)

func main() {
	log.Printf("Starting Proxy server...")
	http.HandleFunc("POST /pixel-draw", publishDraw)
	http.HandleFunc("POST /pixel-update", publishUpdate)
	http.HandleFunc("/temporal", temporal)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
		log.Printf("defaulting to port %s", port)
	}

	log.Printf("listening on port %s", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err)
	}
}

type PubSubMessage struct {
	Message struct {
		Data       string            `json:"data"`
		Attributes map[string]string `json:"attributes"`
		MessageID  string            `json:"messageId"`
	} `json:"message"`
	Subscription string `json:"subscription"`
}

type PixelInfo struct {
	X         int32  `json:"x"`
	Y         int32  `json:"y"`
	Color     uint32 `json:"color"`
	User      string `json:"user"`
	Timestamp string `json:"timestamp"`
}

func temporal(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Printf("Error while reading the request body: %v", err)
		http.Error(w, "Failed to read request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	// Simulate what Pub/Sub does: base64 encode the data
	base64Data := base64.StdEncoding.EncodeToString(body)
	log.Printf("Base64 encoded data: %s", base64Data)

	// Create Pub/Sub message format (simulating Pub/Sub push)
	pubsubMsg := PubSubMessage{}
	pubsubMsg.Message.Data = base64Data
	pubsubMsg.Message.MessageID = fmt.Sprintf("msg-%d", time.Now().Unix())
	pubsubMsg.Message.Attributes = map[string]string{
		"source": "test",
		"type":   "pixel_draw",
	}
	pubsubMsg.Subscription = "projects/serveless-epitech-dev/subscriptions/pixel.draw"

	// Convert to JSON
	jsonData, err := json.Marshal(pubsubMsg)
	if err != nil {
		log.Printf("Failed to marshal JSON: %v", err)
		http.Error(w, "Failed to marshal", http.StatusInternalServerError)
		return
	}

	// Send HTTP request to draw service
	url := "http://localhost:8080/"
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		log.Printf("Failed to send request: %v", err)
		http.Error(w, "Failed to send request", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)
	log.Printf("Response: %s", string(respBody))

	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Test message sent successfully")
}

func publishUpdate(w http.ResponseWriter, r *http.Request) {
	log.Printf("Publish Update function...")
	ctx := r.Context()
	projectId := "serveless-epitech-dev"
	c, err := pubsub.NewClient(ctx, projectId)
	if err != nil {
		log.Printf("Error while retrieving Gcloud Profile: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer c.Close()

	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Printf("Error while reading the request body: %v", err)
		http.Error(w, "Failed to read request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	if !json.Valid(body) {
		log.Printf("Error: messageData is not valid JSON: %s", string(body))
		http.Error(w, "Invalid JSON data", http.StatusBadRequest)
		return
	}

	log.Printf("Received body: %s", body)

	topic := c.Publisher("pixel.draw")
	topic.PublishSettings = pubsub.PublishSettings{
		CountThreshold: 10,
		DelayThreshold: 100 * time.Millisecond,
		ByteThreshold:  1e6,
	}
	defer topic.Stop()

	// Publish raw JSON bytes - Pub/Sub will base64 encode when pushing to HTTP endpoint
	log.Printf("Publishing raw JSON: %s", string(body))

	msgId, err := topic.Publish(ctx, &pubsub.Message{
		Data: body,
	}).Get(ctx)
	if err != nil {
		log.Printf("Error publishing message: %v", err)
		http.Error(w, "Failed to publish message", http.StatusInternalServerError)
		return
	}

	// pubsubMsg.Subscription = "projects/serveless-epitech-dev/subscriptions/pixel.draw"

	// msgID, err := res.Get(ctx)
	// if err != nil {
	// 	log.Printf("Error publishing message: %v", err)
	// 	http.Error(w, "Failed to publish message", http.StatusInternalServerError)
	// 	return
	// }

	log.Printf("Message published successfully with ID: %s", msgId)
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Message published: %s", msgId)
}

func publishDraw(w http.ResponseWriter, r *http.Request) {
	log.Printf("Publish Draw function...")
}
