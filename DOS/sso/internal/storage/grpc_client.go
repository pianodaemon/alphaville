package storage

import (
	"context"
	"fmt"
	"time"

	pb "immortalcrab.com/sso/protos"

	"google.golang.org/grpc"
)

func Authenticate(username, password string) (string, error) {
	// Set up a connection to the server.
	conn, err := grpc.Dial("neon_nights:10080", grpc.WithInsecure())
	if err != nil {
		return "", fmt.Errorf("did not connect: %v", err)
	}

	defer conn.Close()
	c := pb.NewValesClient(conn)

	// Contact the server and print out its response.
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	r, err := c.AuthUser(ctx, &pb.UserCredentialsRequest{Username: username, Passwd: password})
	if err != nil {
		return "", fmt.Errorf("could not Auth User: %v", err)
	}

	rc := r.GetReturnCode()
	if rc < 0 {
		return "", fmt.Errorf("authentication failed for user %s: %s", username, r.GetReturnMessage())
	}

	return fmt.Sprintf("%d", rc), nil
}
