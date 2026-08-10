//
//  AppDelegate.m
//  VeraPad
//
//  A interface é construída em código (sem Main.storyboard) para reduzir
//  pontos de falha e manter total compatibilidade com iOS 9.3.
//

#import "AppDelegate.h"
#import "ViewController.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application
    didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];

    ViewController *root = [[ViewController alloc] init];
    self.window.rootViewController = root;

    [self.window makeKeyAndVisible];
    return YES;
}

@end
