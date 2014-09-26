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

    if(($form['hoh'] != '') AND ($form['order'] != '') AND ($form['amount'] != ''))
		{
			$message = '<html><head><title>Sales Checks Tracking</title></head><body>
			<p>Вам надійшло повідомлення:</p>
            HOH: '. $form['hoh'] .'<br />
			HIX &#124; PEAP &#124; Member ID Number: '. $form['memId'] .'<br />
			Check or Money Order: '. $form['order'] .'<br /><br />
            Check Amount: '. $form['amount'] .'<br />
            Binder Payment: '. $form['bind'] .'<br />
            Manager Name: '. $form['manager'] .'<br />
            Line of Business: '. $form['biz'] .'<br />
            Rep ID Number: '. $form['repId'] .'<br />
			Notes: '. $form['notes'] .'<br />
			</body></html>';

            $message2 = '<html><head><title>Your have submited a form for Sales Checks Tracking </title></head><body>
            <p>Ви скористалися формою реєстрації в тестовій роботі <br>
                яку створив Саша Ющак для ЕГГ МЕН.
            </p>
            HOH: '. $form['hoh'] .'<br />
            HIX &#124; PEAP &#124; Member ID Number: '. $form['memId'] .'<br />
            Check or Money Order: '. $form['order'] .'<br /><br />
            Check Amount: '. $form['amount'] .'<br />
            Binder Payment: '. $form['bind'] .'<br />
            Manager Name: '. $form['manager'] .'<br />
            Line of Business: '. $form['biz'] .'<br />
            Rep ID Number: '. $form['repId'] .'<br />
            Notes: '. $form['notes'] .'<br /><br />
            З повагою,<br /> sashayushchak@gmail.com<br />
            </body></html>';

			$from = 'From: <sashayushchak@gmail.com>' . "\r\n";

            mailto('sashayushchak@gmail.com', 'Coderbit Made', $message, $from);
			mailto($form['email'], 'Test task by Sasha Yushchak', $message2,  $from);

            redirect('0', 'index.html', '<!--h2 style="text-align: center; margin-top:100px;"> Thanks for using this form!</h2-->', '1');
            exit;

        }
?>		

 