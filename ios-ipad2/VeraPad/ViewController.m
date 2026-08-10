//
//  ViewController.m
//  VeraPad
//
//  Tela única de exemplo: título + contador que incrementa ao tocar o botão.
//  Usa Auto Layout via NSLayoutAnchor (disponível desde o iOS 9.0).
//

#import "ViewController.h"

@interface ViewController ()

@property (nonatomic, assign) NSInteger count;
@property (nonatomic, strong) UILabel *countLabel;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];

    self.view.backgroundColor = [UIColor colorWithRed:0.96f green:0.97f blue:0.99f alpha:1.0f];

    UILabel *title = [[UILabel alloc] init];
    title.text = @"Olá, iPad 2!";
    title.font = [UIFont boldSystemFontOfSize:36.0f];
    title.textColor = [UIColor colorWithRed:0.11f green:0.13f blue:0.20f alpha:1.0f];
    title.textAlignment = NSTextAlignmentCenter;
    title.translatesAutoresizingMaskIntoConstraints = NO;
    [self.view addSubview:title];

    UILabel *subtitle = [[UILabel alloc] init];
    subtitle.text = @"App nativo compatível com iOS 9.3.5";
    subtitle.font = [UIFont systemFontOfSize:18.0f];
    subtitle.textColor = [UIColor grayColor];
    subtitle.textAlignment = NSTextAlignmentCenter;
    subtitle.translatesAutoresizingMaskIntoConstraints = NO;
    [self.view addSubview:subtitle];

    self.countLabel = [[UILabel alloc] init];
    self.countLabel.text = @"0";
    self.countLabel.font = [UIFont systemFontOfSize:72.0f];
    self.countLabel.textColor = [UIColor colorWithRed:0.20f green:0.40f blue:0.95f alpha:1.0f];
    self.countLabel.textAlignment = NSTextAlignmentCenter;
    self.countLabel.translatesAutoresizingMaskIntoConstraints = NO;
    [self.view addSubview:self.countLabel];

    UIButton *button = [UIButton buttonWithType:UIButtonTypeSystem];
    [button setTitle:@"Tocar aqui  ( +1 )" forState:UIControlStateNormal];
    button.titleLabel.font = [UIFont systemFontOfSize:22.0f];
    button.translatesAutoresizingMaskIntoConstraints = NO;
    [button addTarget:self
               action:@selector(incrementTapped)
     forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:button];

    [NSLayoutConstraint activateConstraints:@[
        [title.centerXAnchor constraintEqualToAnchor:self.view.centerXAnchor],
        [title.centerYAnchor constraintEqualToAnchor:self.view.centerYAnchor constant:-150.0f],

        [subtitle.centerXAnchor constraintEqualToAnchor:self.view.centerXAnchor],
        [subtitle.topAnchor constraintEqualToAnchor:title.bottomAnchor constant:12.0f],

        [self.countLabel.centerXAnchor constraintEqualToAnchor:self.view.centerXAnchor],
        [self.countLabel.centerYAnchor constraintEqualToAnchor:self.view.centerYAnchor],

        [button.centerXAnchor constraintEqualToAnchor:self.view.centerXAnchor],
        [button.topAnchor constraintEqualToAnchor:self.countLabel.bottomAnchor constant:40.0f],
    ]];
}

- (void)incrementTapped {
    self.count += 1;
    self.countLabel.text = [NSString stringWithFormat:@"%ld", (long)self.count];
}

@end
