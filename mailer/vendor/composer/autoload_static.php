<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitd2164b3b01b62222aba4304cfcace065
{
    public static $prefixLengthsPsr4 = array (
        'P' => 
        array (
            'PHPMailer\\PHPMailer\\' => 20,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'PHPMailer\\PHPMailer\\' => 
        array (
            0 => __DIR__ . '/..' . '/phpmailer/phpmailer/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInitd2164b3b01b62222aba4304cfcace065::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInitd2164b3b01b62222aba4304cfcace065::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInitd2164b3b01b62222aba4304cfcace065::$classMap;

        }, null, ClassLoader::class);
    }
}
