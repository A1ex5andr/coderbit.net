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

    if(($form['name'] != '') AND ($form['email'] != '') AND ($form['password'] != ''))
		{
			$message = '<html><head><title>registration uawebchallenge</title></head><body>
			<p>Вам надійшло повідомлення:</p>
			Name: '. $form['name'] .'<br />
			Email: '. $form['email'] .'<br /><br />
			Password: '. $form['password'] .'<br />
			</body></html>';

            $message2 = '<html><head><title>Your have register in </title></head><body>
            <p>Ви скористалися формою реєстрації в конкурсній роботі <br>
                для uawebchallenge яку створив Саша Ющак.
            </p>
            Name: '. $form['name'] .'<br />
            Email: '. $form['email'] .'<br />
            Password: '. $form['password'] .'<br /><br />
            З повагою,<br /> sashayushchak@gmail.com<br />
            </body></html>';

			$from = 'From: <sashayushchak@gmail.com>' . "\r\n";

            mailto('sashayushchak@gmail.com', 'Coderbit Made', $message, $from);
			mailto($form['email'], 'UAwebChallenge - Sasha Yushchak', $message2,  $from);

            redirect('0', 'index.html', '<!--h2 style="text-align: center; margin-top:100px;"> Thanks for registration!</h2-->', '1');
            exit;

            // setcookie('uaWeb','registered', time()+(60*60*24*31));
        }
?>		

 