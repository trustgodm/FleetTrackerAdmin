import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  BookOpen,
  Video,
  FileText,
  Download,
  ExternalLink,
  ChevronRight,
  Star,
  Users,
  Car,
  BarChart3,
  Wrench,
  MapPin as MapPinIcon
} from "lucide-react";
import { toast } from "sonner";

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const faqs = [
    {
      question: "How do I add a new vehicle to the fleet?",
      answer: "Navigate to the Fleet page and click 'Add Vehicle'. Fill in the required information including vehicle details, registration, and assign it to a department. You can also upload vehicle photos and documents."
    },
    {
      question: "How do I start a new trip?",
      answer: "Go to the Tracking page and click 'Start New Trip'. Select the vehicle, driver, and enter trip details including purpose, start location, and estimated duration. The system will track the trip in real-time."
    },
    {
      question: "How do I schedule maintenance?",
      answer: "Navigate to the Maintenance page and click 'Schedule Maintenance'. Select the vehicle, choose the maintenance type, set the due date, and add any notes. You'll receive notifications when maintenance is due."
    },
    {
      question: "How do I generate reports?",
      answer: "Go to the Analytics page and select the 'Reports' tab. Choose the type of report you need (fleet summary, fuel consumption, maintenance schedule, etc.) and click 'Download' to get a CSV file."
    },
    {
      question: "How do I manage user permissions?",
      answer: "As an administrator, you can manage user permissions through the Settings page. Navigate to User Management and assign roles (Admin, Manager, Driver) with appropriate access levels."
    },
    {
      question: "How do I track fuel consumption?",
      answer: "Use the Fuel Management page to record fuel purchases and consumption. Enter fuel type, quantity, cost, and odometer reading. The system will calculate efficiency metrics automatically."
    },
    {
      question: "How do I set up notifications?",
      answer: "Go to Settings > Notifications to configure email and push notifications. You can enable alerts for maintenance, trip updates, system alerts, and weekly reports."
    },
    {
      question: "How do I export data?",
      answer: "Navigate to Settings > Preferences > Data Management. Click 'Export Data' to download your fleet information in CSV format. You can also import data using the 'Import Data' feature."
    }
  ];

  const quickGuides = [
    {
      title: "Getting Started",
      description: "Learn the basics of Fleet Tracker fleet management",
      icon: BookOpen,
      link: "#"
    },
    {
      title: "Vehicle Management",
      description: "How to add, edit, and manage your fleet vehicles",
      icon: Car,
      link: "#"
    },
    {
      title: "Trip Tracking",
      description: "Complete guide to tracking and managing trips",
      icon: MapPinIcon,
      link: "#"
    },
    {
      title: "Maintenance Scheduling",
      description: "How to schedule and track vehicle maintenance",
      icon: Wrench,
      link: "#"
    },
    {
      title: "Analytics & Reports",
      description: "Understanding your fleet analytics and reports",
      icon: BarChart3,
      link: "#"
    },
    {
      title: "User Management",
      description: "Managing users and permissions",
      icon: Users,
      link: "#"
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Support request submitted successfully. We'll get back to you within 24 hours.");
    setContactForm({ name: "", email: "", subject: "", message: "" });
  };

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Help Center</h1>
          <p className="text-muted-foreground">Get help and support for Fleet Tracker fleet management system</p>
        </div>

        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="guides">Quick Guides</TabsTrigger>
            <TabsTrigger value="contact">Contact Support</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="space-y-6">
            <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search FAQ
                </CardTitle>
                <CardDescription>
                  Find answers to common questions about Fleet Tracker
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for help topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Common questions and answers about using Fleet Tracker
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guides" className="space-y-6">
            <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Quick Start Guides
                </CardTitle>
                <CardDescription>
                  Step-by-step guides to help you get the most out of Fleet Tracker
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {quickGuides.map((guide, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <guide.icon className="h-8 w-8 text-primary mt-1" />
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{guide.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{guide.description}</p>
                            <Button variant="ghost" size="sm" className="p-0 h-auto">
                              <span className="text-primary">Read Guide</span>
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Contact Support
                  </CardTitle>
                  <CardDescription>
                    Get in touch with our support team for personalized assistance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={contactForm.message}
                        onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                        rows={4}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
                <CardHeader>
                  <CardTitle>Support Information</CardTitle>
                  <CardDescription>
                    Multiple ways to get help with Fleet Tracker
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Phone Support</p>
                        <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                        <p className="text-xs text-muted-foreground">Mon-Fri 8AM-6PM EST</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Email Support</p>
                        <p className="text-sm text-muted-foreground">support@tworiversplatinum.com</p>
                        <p className="text-xs text-muted-foreground">24/7 response within 24 hours</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Office Location</p>
                        <p className="text-sm text-muted-foreground">Fleet Tracker HQ</p>
                        <p className="text-xs text-muted-foreground">123 Fleet Street, Suite 100</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Response Time</p>
                        <p className="text-sm text-muted-foreground">Within 24 hours</p>
                        <p className="text-xs text-muted-foreground">Priority support available</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documentation & Resources
                </CardTitle>
                <CardDescription>
                  Download manuals, watch tutorials, and access additional resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <FileText className="h-6 w-6 text-primary" />
                        <div>
                          <h3 className="font-semibold">User Manual</h3>
                          <p className="text-sm text-muted-foreground">Complete system guide</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Video className="h-6 w-6 text-primary" />
                        <div>
                          <h3 className="font-semibold">Video Tutorials</h3>
                          <p className="text-sm text-muted-foreground">Step-by-step videos</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Watch Videos
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <BookOpen className="h-6 w-6 text-primary" />
                        <div>
                          <h3 className="font-semibold">API Documentation</h3>
                          <p className="text-sm text-muted-foreground">Developer resources</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Docs
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Star className="h-6 w-6 text-primary" />
                        <div>
                          <h3 className="font-semibold">Best Practices</h3>
                          <p className="text-sm text-muted-foreground">Fleet management tips</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Read Guide
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Users className="h-6 w-6 text-primary" />
                        <div>
                          <h3 className="font-semibold">Training Materials</h3>
                          <p className="text-sm text-muted-foreground">Staff training resources</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <HelpCircle className="h-6 w-6 text-primary" />
                        <div>
                          <h3 className="font-semibold">Troubleshooting</h3>
                          <p className="text-sm text-muted-foreground">Common issues & solutions</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Guide
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}