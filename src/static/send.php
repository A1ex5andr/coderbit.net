<?php
    foreach($_POST as $key => $value)
    {
        $value = trim($value);
        $value = addslashes(htmlspecialchars($value));
        $form[$key] = $value;
    }

function redirect($time, $link, $text, $exit)
    {
        print"<html><head><meta http-equiv=\"refresh\" content=\"".$time."; url=".$link."\"></head>
	        <body>
		        ".$text."<p align=center><a href=\"".$link."\">"."</a><br><br>
	        </body>
        </html>"; 
        if ($exit == '1'){exit;}
    }

function mailto($to,$subject,$message,$from)
    {
        $headers  = 'MIME-Version: 1.0' . "\r\n";
        $headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
        $headers .= $from."\r\n";

        mail($to, $subject, $message, $headers);  
    }    



    $message = '<html><head><title>Coderbit | Alexander Yushchak</title></head><body>
    <p>New Message:</p>
    Name: '. $form['name'] .'<br />
    Mail: '. $form['mail'] .'<br />
    Text: '. $form['message'] .'<br />
    </body></html>';

    $message2 = '<html><head><title>Coderbit | Alexander Yushchak</title></head><body>
    <p>Thank you for your message,<br>
        I\'ll answer you asap.
    </p><br />
    You wrote: <br>
    Name: '. $form['name'] .'<br />
    Mail: '. $form['mail'] .'<br />
    Text: '. $form['message'] .'<br />
    <br />
    Best regards,<br />
    Coderbit | Alexander Yushchak<br />
    </body></html>';

    $from = 'From: alex@coderbit.net' . "\r\n";

    mailto('sashayushchak@gmail.com', 'Coderbit Made', $message, $from);
    mailto($form['mail'], 'Coderbit.net - message received', $message2,  $from);

    redirect('0', '//coderbit.net', '<!--h2 style="text-align: center; margin-top:100px;"> Thanks for using this form!</h2-->', '1');
    exit;


?>		

 