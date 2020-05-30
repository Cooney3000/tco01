<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>TC Olching <?= $title ?></title>

    <!-- Bootstrap core CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    
    <!-- Custom styles for this template -->
    <link href="/intern/css/styles.css" rel="stylesheet">
    <script src="https://kit.fontawesome.com/b20dcfa647.js" crossorigin="anonymous"></script>
  </head>
  <body>
  
      <div>
        <a href="/"><img src="/images/tcoplain_0,1x.png" alt="TCO Logo"></a>
        <div class="klein">
          <?= isset($user['vorname']) ? htmlentities(trim($user['vorname']).' '.trim($user['nachname'])) : "" ?>
        </div>
      </div>

<div class="container main-container">
  
<h1>Die TCO Platzbuchung ist in Überarbeitung!</h1>
<h2>Leider hat sich ein Fehler eingeschlichen. Ich arbeite daran. Ab 12:00h hoffentlich wieder verfügbar. Euer Conny</h2>

</div>


<?php
include("../templates/footer.inc.php")
?>