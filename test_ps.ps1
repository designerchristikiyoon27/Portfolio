Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("c:\Users\himan\Downloads\Portfolio\Portfolio_media\render-livingroom.jpg")
$bmp = New-Object System.Drawing.Bitmap($img, 800, ([int]($img.Height * (800.0 / $img.Width))))
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]70)
$bmp.Save("c:\Users\himan\Downloads\Portfolio\Portfolio_media\test_compress.jpg", $codec, $encoderParams)
$bmp.Dispose()
$img.Dispose()
