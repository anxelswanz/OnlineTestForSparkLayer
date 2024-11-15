package main

import (
	"encoding/json"
	"net/http"
)

func main() {
	// Your code here
	http.HandleFunc("/", ToDoListHandler)
	// run the server on port 8081
	http.ListenAndServe(":8081", nil)
}

// Model: Item
type Item struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

// toDoList: Store the data
var toDoList []Item

// AddItem function
func AddItem(item *Item) {
	toDoList = append(toDoList, *item)
}

func ToDoListHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")

	// Your code here
	// receieve json data
	w.Header().Set("Content-Type", "application/json")

	//1. If the request method is GET
	if (r.Method == "GET") {
		//1.1 using the Encode Method
		json.NewEncoder(w).Encode(toDoList)
		//1.2 Set the status code 200
		w.WriteHeader(http.StatusOK)
		return
		//2. If the request method is POST
	} else if (r.Method == "POST") {
		// 2.1 If there's nothing in the request body, then return bad request
		// [Explanation]
		// usually I add @NotNull/@NotEmpty annotation in Java for this validation
		if (r.Body == nil) {
			http.Error(w, "Invalid Input", http.StatusBadRequest)
			return
		}
		// 2.2 If 2.1 is passed, then we need to get the json from the front-end
		// by using the Decode Method
		var newItem Item
		// [Explanation]
		// for this I usually need to try/catch or throw an exception
		// in Java because it could lead to JsonParseException
		// but for now I don't do anything as I am worried that I might do it wrong

		json.NewDecoder(r.Body).Decode(&newItem)
		// 2.3 Add an item
		AddItem(&newItem)
		// 2.4 Set the status code to ok(200)
		w.WriteHeader(http.StatusOK)
		// 2.5 return an entity to check if it's added successfully
		json.NewEncoder(w).Encode(&newItem)

	} else {
		// 3. If the requests are other types return 400
		http.Error(w, "Invalid Input", http.StatusBadRequest)
		return
	}
}
