import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Copy, Loader2, FileText, CheckCircle } from "lucide-react";

const StudentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    college: "",
    certificateType: "",
  });
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const certificateTypes = [
    "Bonafide Certificate",
    "Study Certificate", 
    "Character Certificate",
    "Transfer Certificate",
    "Course Completion Certificate",
    "Academic Transcript",
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateLetter = async () => {
    if (!formData.name || !formData.college || !formData.certificateType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(
        "https://skee-mff5fbkc-eastus2.cognitiveservices.azure.com/openai/deployments/Letter-generator/chat/completions?api-version=2025-01-01-preview",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": "F7UGRXFhkjG9JIsUm3s2FXx089ON7lBfruo87vCnJAEzR165MgCYJQQJ99BIACHYHv6XJ3w3AAAAACOGpbGy",
          },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content: "You are an expert at generating formal academic certificates and letters. Generate professional, properly formatted certificate letters based on the provided student information."
              },
              {
                role: "user",
                content: `Generate a formal ${formData.certificateType} for:
                
Student Name: ${formData.name}
College: ${formData.college}
Certificate Type: ${formData.certificateType}

Please create a professional, formal letter that includes:
- Proper letterhead format
- Official language and tone
- Relevant details for this type of certificate
- Appropriate closing and signature line
- Current date

Make it look like an official academic document.`
              }
            ],
            max_tokens: 1000,
            temperature: 0.3,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const letter = data.choices[0]?.message?.content || "Error generating letter";
      setGeneratedLetter(letter);
      
      toast({
        title: "Certificate Generated",
        description: "Your certificate letter has been successfully generated.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error generating letter:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate certificate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLetter);
      toast({
        title: "Copied!",
        description: "Certificate letter copied to clipboard.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Form Card */}
      <Card className="shadow-form">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-institutional" />
            Certificate Request Form
          </CardTitle>
          <CardDescription>
            Fill out the form below to generate your certificate letter
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Student Name *</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="shadow-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="college">College/Institution *</Label>
              <Input
                id="college"
                placeholder="Enter college name"
                value={formData.college}
                onChange={(e) => handleInputChange("college", e.target.value)}
                className="shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="certificateType">Certificate Type *</Label>
            <Select value={formData.certificateType} onValueChange={(value) => handleInputChange("certificateType", value)}>
              <SelectTrigger className="shadow-sm">
                <SelectValue placeholder="Select certificate type" />
              </SelectTrigger>
              <SelectContent>
                {certificateTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={generateLetter}
            disabled={isLoading}
            className="w-full"
            variant="institutional"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating Certificate...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Generate Certificate Letter
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Letter Display */}
      {generatedLetter && (
        <Card className="shadow-document">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                Generated Certificate Letter
              </div>
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
              >
                <Copy className="h-4 w-4" />
                Copy Letter
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-document border border-document-border rounded-lg p-6 shadow-document">
              <Textarea
                value={generatedLetter}
                readOnly
                className="min-h-[400px] bg-transparent border-none resize-none font-mono text-sm leading-relaxed"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentForm;
