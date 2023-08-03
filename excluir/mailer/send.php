<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';



if (isset($_POST['nome'], $_POST['email'])) {

    $nome = addslashes($_POST['nome']);
    $numero = addslashes($_POST['numero']);
    $email = addslashes($_POST['email']);
    $mensagem = addslashes($_POST['mensagem']);


    if (strlen($nome) > 1 && strlen($email) > 1 && strlen($mensagem) > 1) {

        $mail = new PHPMailer(true);

        try {
            //Server settings
            $mail->isSMTP();                                          
            $mail->Host       = 'SEU HOST';                    
            $mail->SMTPAuth   = true;                                 
            $mail->Username   = 'SEU USER';                     
            $mail->Password   = 'SUA SENHA';                              
            $mail->Port       = 587;                                  

            //Recipients
            $mail->setFrom("support@cutetoonstore.com", 'NOME DO SITE');
            $mail->addAddress($email, $nome);  
            $mail->addReplyTo("support@cutetoonstore.com", 'NOME DO SITE');



            //Content
            $mail->isHTML(true); 
            $mail->Subject = 'Contato Via Site';
            $mail->Body    = "Nome: ".$nome."<br>".$mensagem."<br>"."Telefone: ".$numero;
            $mail->AltBody = "Nome: ".$nome." - ".$mensagem." - Telefone: ".$numero;
            $mail->send();

            // Redireciona para  a mensagem de sucesso
           header('Location: sucesso.html');
        } catch (Exception $e) {
            //echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";

            // Redireciona para  a mensagem de erro
            header('Location: erro.html');
        }
    } else {
        // Redireciona para  a mensagem de erro se a pessoa nao digitar tudo certo
        header('Location: erro.html');
    }
} else {
    // Redireciona para  a mensagem de erro se a pessoa nao digitar algum campo
    header('Location: erro.html');
}
