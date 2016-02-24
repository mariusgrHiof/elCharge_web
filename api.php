<?php
$servername ="frigg.hiof.no";
$username ="bo16g6";
$password ="bgGGY5DB";


// Create connection
$conn = new mysqli($servername, $username, $password, $username);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
//echo "Connected successfully";


//Eksempelkode for query:
//Adding, updating or deleting ingredients
$sql = "select count(*) from ingredient";
$result = $conn->query($sql);
$new_ingredient_id = 0;

if($result->num_rows > 0){
    while($row = $result->fetch_assoc()){
         $new_user_id = ($row['count(*)'] == 0 ? $row['count(*)'] : $row['count(*)']);
    }
}
if(!empty($_GET['name'])){
    if($_GET['name'] == "insert"){
        $sql = "INSERT INTO user
                    VALUES (
                    '" . $new_user_id . "',
                    '". $_GET['name']. "',
                    )";
        if ($conn->query($sql) === TRUE) {
            echo "User added successfully";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }
}
?>
<html>

<head>
</head>
<body>
	<!-- Stuff yo-->
    <form action = "#" method="post">
        <input type="text" name="username" placeholder="username">
        <input type="password" name ="password">
        <input type="submit" value="Submit">
    </form>
</body>
</html>
<?php
//Closing connections
$conn->close();
?>
