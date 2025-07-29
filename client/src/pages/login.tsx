import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEnvelope, faBirthdayCake, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faFacebook, faGithub } from "@fortawesome/free-brands-svg-icons";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Login() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });
  
  // Registration form state
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    birthDate: ""
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('user_token', data.token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in to your mystical journey.",
        });
        
        navigate("/");
      } else {
        const error = await response.json();
        toast({
          title: "Login Failed",
          description: error.message || "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to the server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Please ensure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: registerForm.username,
          email: registerForm.email,
          password: registerForm.password,
          firstName: registerForm.firstName,
          lastName: registerForm.lastName,
          birthDate: registerForm.birthDate
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('user_token', data.token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        
        toast({
          title: "Welcome to Mystic Fortune!",
          description: "Your spiritual journey begins now. Your cosmic profile has been created.",
        });
        
        navigate("/");
      } else {
        const error = await response.json();
        toast({
          title: "Registration Failed",
          description: error.message || "Unable to create account. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to the server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Redirect to OAuth provider
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-950">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg"
        >
          <Card className="bg-purple-900/30 border-purple-600/50 shadow-2xl backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="font-['Cinzel'] text-3xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                Enter the Mystic Realm
              </CardTitle>
              <CardDescription className="text-purple-300">
                Join thousands discovering their cosmic destiny
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="login" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 bg-purple-800/30">
                  <TabsTrigger value="login" className="data-[state=active]:bg-purple-700">
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="register" className="data-[state=active]:bg-purple-700">
                    Join Now
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-purple-200">Email</Label>
                      <div className="relative">
                        <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-3 text-purple-400" />
                        <Input
                          id="email"
                          type="email"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                          className="pl-10 bg-purple-800/30 border-purple-600/50 text-white placeholder-purple-400"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-purple-200">Password</Label>
                      <div className="relative">
                        <FontAwesomeIcon icon={faLock} className="absolute left-3 top-3 text-purple-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                          className="pl-10 pr-10 bg-purple-800/30 border-purple-600/50 text-white placeholder-purple-400"
                          placeholder="Enter your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-purple-400 hover:text-purple-300"
                        >
                          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </button>
                      </div>
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-purple-950 font-semibold"
                    >
                      {isLoading ? "Connecting to the cosmos..." : "Enter the Realm"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="register" className="space-y-4">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-purple-200">First Name</Label>
                        <Input
                          id="firstName"
                          value={registerForm.firstName}
                          onChange={(e) => setRegisterForm({...registerForm, firstName: e.target.value})}
                          className="bg-purple-800/30 border-purple-600/50 text-white placeholder-purple-400"
                          placeholder="First name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-purple-200">Last Name</Label>
                        <Input
                          id="lastName"
                          value={registerForm.lastName}
                          onChange={(e) => setRegisterForm({...registerForm, lastName: e.target.value})}
                          className="bg-purple-800/30 border-purple-600/50 text-white placeholder-purple-400"
                          placeholder="Last name"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-purple-200">Username</Label>
                      <div className="relative">
                        <FontAwesomeIcon icon={faUser} className="absolute left-3 top-3 text-purple-400" />
                        <Input
                          id="username"
                          value={registerForm.username}
                          onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                          className="pl-10 bg-purple-800/30 border-purple-600/50 text-white placeholder-purple-400"
                          placeholder="Choose a mystical username"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="regEmail" className="text-purple-200">Email</Label>
                      <div className="relative">
                        <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-3 text-purple-400" />
                        <Input
                          id="regEmail"
                          type="email"
                          value={registerForm.email}
                          onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                          className="pl-10 bg-purple-800/30 border-purple-600/50 text-white placeholder-purple-400"
                          placeholder="Your email address"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="birthDate" className="text-purple-200">Birth Date (for zodiac insights)</Label>
                      <div className="relative">
                        <FontAwesomeIcon icon={faBirthdayCake} className="absolute left-3 top-3 text-purple-400" />
                        <Input
                          id="birthDate"
                          type="date"
                          value={registerForm.birthDate}
                          onChange={(e) => setRegisterForm({...registerForm, birthDate: e.target.value})}
                          className="pl-10 bg-purple-800/30 border-purple-600/50 text-white placeholder-purple-400"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="regPassword" className="text-purple-200">Password</Label>
                      <div className="relative">
                        <FontAwesomeIcon icon={faLock} className="absolute left-3 top-3 text-purple-400" />
                        <Input
                          id="regPassword"
                          type="password"
                          value={registerForm.password}
                          onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                          className="pl-10 bg-purple-800/30 border-purple-600/50 text-white placeholder-purple-400"
                          placeholder="Create a secure password"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-purple-200">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                        className="bg-purple-800/30 border-purple-600/50 text-white placeholder-purple-400"
                        placeholder="Confirm your password"
                        required
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-purple-950 font-semibold"
                    >
                      {isLoading ? "Creating your cosmic profile..." : "Begin Your Journey"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
              
              {/* Social Login Options */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-purple-600/50"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-purple-900/30 text-purple-300">Or continue with</span>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin('google')}
                    className="border-purple-600/50 bg-purple-800/30 hover:bg-purple-700/50 text-white"
                  >
                    <FontAwesomeIcon icon={faGoogle} />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin('facebook')}
                    className="border-purple-600/50 bg-purple-800/30 hover:bg-purple-700/50 text-white"
                  >
                    <FontAwesomeIcon icon={faFacebook} />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin('github')}
                    className="border-purple-600/50 bg-purple-800/30 hover:bg-purple-700/50 text-white"
                  >
                    <FontAwesomeIcon icon={faGithub} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
}