Add-Type -AssemblyName System.Drawing

function Build-Logo {
    param (
        [int]$Size,
        [string]$OutPath
    )

    $bmp = New-Object System.Drawing.Bitmap($Size, $Size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    $rect = New-Object System.Drawing.Rectangle(0, 0, $Size, $Size)
    $c1 = [System.Drawing.Color]::FromArgb(255, 79, 70, 229)   # Indigo #4F46E5
    $c2 = [System.Drawing.Color]::FromArgb(255, 5, 150, 105)   # Emerald #059669
    $grad = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $c1, $c2, 45.0)

    # Squircle background
    $r = [Math]::Floor($Size * 0.25)
    $d = $r * 2
    $pad = [Math]::Floor($Size * 0.02)
    $w = $Size - ($pad * 2)
    
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddArc($pad, $pad, $d, $d, 180, 90)
    $path.AddArc($pad + $w - $d, $pad, $d, $d, 270, 90)
    $path.AddArc($pad + $w - $d, $pad + $w - $d, $d, $d, 0, 90)
    $path.AddArc($pad, $pad + $w - $d, $d, $d, 90, 90)
    $path.CloseFigure()
    $g.FillPath($grad, $path)

    # Subtle inner border
    $penColor = [System.Drawing.Color]::FromArgb(65, 255, 255, 255)
    $pen = New-Object System.Drawing.Pen($penColor, [float]($Size * 0.025))
    $g.DrawPath($pen, $path)

    # White brush for geometric 'K'
    $white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)

    # Vertical bar
    $stemX = [Math]::Floor($Size * 0.25)
    $stemY = [Math]::Floor($Size * 0.23)
    $stemW = [Math]::Floor($Size * 0.125)
    $stemH = [Math]::Floor($Size * 0.54)
    $stemR = [Math]::Floor($stemW * 0.45)
    $sd = $stemR * 2

    $stemPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $stemPath.AddArc($stemX, $stemY, $sd, $sd, 180, 90)
    $stemPath.AddArc($stemX + $stemW - $sd, $stemY, $sd, $sd, 270, 90)
    $stemPath.AddArc($stemX + $stemW - $sd, $stemY + $stemH - $sd, $sd, $sd, 0, 90)
    $stemPath.AddArc($stemX, $stemY + $stemH - $sd, $sd, $sd, 90, 90)
    $stemPath.CloseFigure()
    $g.FillPath($white, $stemPath)

    # Upper diagonal arm
    $upPoints = [System.Drawing.PointF[]]@(
        (New-Object System.Drawing.PointF([float]($Size * 0.35), [float]($Size * 0.48))),
        (New-Object System.Drawing.PointF([float]($Size * 0.59), [float]($Size * 0.24))),
        (New-Object System.Drawing.PointF([float]($Size * 0.69), [float]($Size * 0.33))),
        (New-Object System.Drawing.PointF([float]($Size * 0.45), [float]($Size * 0.57)))
    )
    $g.FillPolygon($white, $upPoints)

    # Lower diagonal arm
    $dnPoints = [System.Drawing.PointF[]]@(
        (New-Object System.Drawing.PointF([float]($Size * 0.42), [float]($Size * 0.51))),
        (New-Object System.Drawing.PointF([float]($Size * 0.67), [float]($Size * 0.74))),
        (New-Object System.Drawing.PointF([float]($Size * 0.57), [float]($Size * 0.84))),
        (New-Object System.Drawing.PointF([float]($Size * 0.32), [float]($Size * 0.61)))
    )
    $g.FillPolygon($white, $dnPoints)

    # Emerald Touchpoint Circle
    $nodeColor = [System.Drawing.Color]::FromArgb(255, 16, 185, 129)
    $nodeBrush = New-Object System.Drawing.SolidBrush($nodeColor)
    $nodeR = [Math]::Floor($Size * 0.08)
    $nodeX = [Math]::Floor($Size * 0.72)
    $nodeY = [Math]::Floor($Size * 0.50)
    $g.FillEllipse($nodeBrush, [float]($nodeX - $nodeR), [float]($nodeY - $nodeR), [float]($nodeR * 2), [float]($nodeR * 2))

    # Inner core
    $innerR = [Math]::Floor($Size * 0.035)
    $g.FillEllipse($white, [float]($nodeX - $innerR), [float]($nodeY - $innerR), [float]($innerR * 2), [float]($innerR * 2))

    $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Created $OutPath ($Size x $Size)"
}

Build-Logo -Size 128 -OutPath "public/assets/logo.png"
Build-Logo -Size 512 -OutPath "public/assets/logo-xl.png"
