<?php
// Routes

$app->get('/', function () {
    // Sample log message
   // $this->logger->info("Slim-Skeleton '/' route");

    // Render index view
	echo 'Home - My Slim App';	
});
  //get all cars
  $app->get('/cars', function ($request, $response, $args) {
        $sth = $this->db->prepare("SELECT * FROM cars ");
        $sth->execute();
        $cars = $sth->fetchAll();
        return $this->response->withJson($cars);
    });
  //get car by id
  $app->get('/cars/[{id}]', function ($request, $response, $args) {
        $sth = $this->db->prepare("SELECT * FROM cars WHERE id=:id");
	$sth->bindParam("id",$args['id']);
        $sth->execute();
        $cars = $sth->fetchAll();
        return $this->response->withJson($cars);
    });
  //add method   
  $app->post('/car', function ($request, $response) {
	$input = $request->getParsedBody();
	//print_r($input);
	
	$sql="INSERT INTO cars (year,make,model) VALUES (:year,:make,:model)";
	$sth=$this->db->prepare($sql);

	$sth->bindParam("year",$input['year']);
	$sth->bindParam("make",$input['make']);
	$sth->bindParam("model",$input['model']);
	$sth->execute();	
	
	$input['id'] = $this->db->lastInsertId();
	return $this->response->withJson($input);
    });
    //delete method
    $app->delete('/car/[{id}]', function ($request, $response, $args) {
            $sth = $this->db->prepare("DELETE FROM cars WHERE id=:id");
            $sth->bindParam("id", $args['id']);
            $sth->execute();
            
            echo json_encode(array(
                "status" => true,
                "message" => "Car deleted successfully"
            ));
        });

    
    
    
