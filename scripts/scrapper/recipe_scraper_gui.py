import tkinter as tk
from tkinter import ttk, scrolledtext, messagebox, filedialog
import requests
from bs4 import BeautifulSoup
import json
import os
import re
import time
import random
from datetime import datetime
import supabase
from dotenv import load_dotenv
import asyncio
import threading

# Load environment variables
load_dotenv()

# Initialize API keys and URLs
supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
supabase_key = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
deepseek_api_key = os.getenv('NEXT_PUBLIC_DEEPSEEK_API_KEY')
deepseek_api_url = os.getenv('NEXT_PUBLIC_DEEPSEEK_API_URL', 'https://api.deepseek.com/v1/chat/completions')

class RecipeScraperApp:
    def __init__(self, root):
        self.root = root
        self.root.title("PantryPal Recipe Enhancement Scraper")
        self.root.geometry("900x700")
        self.root.configure(bg='#f5f5f5')
        
        # Initialize Supabase client if environment variables are available
        self.supabase_client = None
        if supabase_url and supabase_key:
            try:
                self.supabase_client = supabase.create_client(supabase_url, supabase_key)
                print("Supabase client initialized successfully")
            except Exception as e:
                print(f"Error initializing Supabase client: {e}")
        
        # Recipe ID input
        self.recipe_id_frame = ttk.Frame(root)
        self.recipe_id_frame.pack(fill='x', padx=20, pady=10)
        
        self.recipe_id_label = ttk.Label(self.recipe_id_frame, text="Recipe ID:")
        self.recipe_id_label.pack(side='left', padx=5)
        
        self.recipe_id_entry = ttk.Entry(self.recipe_id_frame, width=10)
        self.recipe_id_entry.pack(side='left', padx=5)
        
        self.recipe_title_label = ttk.Label(self.recipe_id_frame, text="Recipe Title:")
        self.recipe_title_label.pack(side='left', padx=5)
        
        self.recipe_title_entry = ttk.Entry(self.recipe_id_frame, width=40)
        self.recipe_title_entry.pack(side='left', padx=5)
        
        # URL input
        self.url_frame = ttk.Frame(root)
        self.url_frame.pack(fill='x', padx=20, pady=5)
        
        self.url_label = ttk.Label(self.url_frame, text="Recipe URL:")
        self.url_label.pack(side='left', padx=5)
        
        self.url_entry = ttk.Entry(self.url_frame, width=80)
        self.url_entry.pack(side='left', padx=5, fill='x', expand=True)
        
        # Website selection
        self.site_frame = ttk.Frame(root)
        self.site_frame.pack(fill='x', padx=20, pady=5)
        
        self.site_label = ttk.Label(self.site_frame, text="Website Type:")
        self.site_label.pack(side='left', padx=5)
        
        self.site_var = tk.StringVar(value="allrecipes")
        self.sites = ["allrecipes", "foodnetwork", "epicurious", "bbcgoodfood", "simplyrecipes", "seriouseats", "other"]
        
        for site in self.sites:
            site_radio = ttk.Radiobutton(
                self.site_frame, 
                text=site.capitalize(), 
                value=site, 
                variable=self.site_var
            )
            site_radio.pack(side='left', padx=5)
        
        # Buttons frame
        self.button_frame = ttk.Frame(root)
        self.button_frame.pack(fill='x', padx=20, pady=10)
        
        self.scrape_button = ttk.Button(self.button_frame, text="Scrape Enhancements", command=self.scrape_enhancements)
        self.scrape_button.pack(side='left', padx=5)
        
        self.clean_button = ttk.Button(self.button_frame, text="Clean Enhancements", command=self.clean_enhancements)
        self.clean_button.pack(side='left', padx=5)
        
        self.deepseek_button = ttk.Button(self.button_frame, text="Clean with DeepSeek AI", command=self.clean_with_deepseek)
        self.deepseek_button.pack(side='left', padx=5)
        
        self.batch_button = ttk.Button(self.button_frame, text="Batch Scrape from File", command=self.batch_scrape)
        self.batch_button.pack(side='left', padx=5)
        
        self.save_db_button = ttk.Button(self.button_frame, text="Save to Database", command=self.save_to_database)
        self.save_db_button.pack(side='left', padx=5)
        
        self.save_file_button = ttk.Button(self.button_frame, text="Save to File", command=self.save_to_file)
        self.save_file_button.pack(side='left', padx=5)

        self.manual_button = ttk.Button(self.button_frame, text="Manual Entry", command=self.open_manual_entry)
        self.manual_button.pack(side='left', padx=5)

        self.clear_button = ttk.Button(self.button_frame, text="Clear", command=self.clear_results)
        self.clear_button.pack(side='left', padx=5)
        
        # Tabs for different sections
        self.tabs = ttk.Notebook(root)
        self.tabs.pack(fill='both', expand=True, padx=20, pady=10)
        
        # Tab for scraped enhancements
        self.enhancements_tab = ttk.Frame(self.tabs)
        self.tabs.add(self.enhancements_tab, text="Enhancements")
        
        self.enhancements_frame = ttk.Frame(self.enhancements_tab)
        self.enhancements_frame.pack(fill='both', expand=True, padx=10, pady=10)
        
        self.enhancements_label = ttk.Label(self.enhancements_frame, text="Scraped Enhancements:")
        self.enhancements_label.pack(anchor='w', pady=5)
        
        self.enhancements_text = scrolledtext.ScrolledText(self.enhancements_frame, width=80, height=15)
        self.enhancements_text.pack(fill='both', expand=True)
        
        # Tab for raw HTML
        self.html_tab = ttk.Frame(self.tabs)
        self.tabs.add(self.html_tab, text="Raw HTML")
        
        self.html_frame = ttk.Frame(self.html_tab)
        self.html_frame.pack(fill='both', expand=True, padx=10, pady=10)
        
        self.html_label = ttk.Label(self.html_frame, text="Raw HTML:")
        self.html_label.pack(anchor='w', pady=5)
        
        self.html_text = scrolledtext.ScrolledText(self.html_frame, width=80, height=15)
        self.html_text.pack(fill='both', expand=True)
        
        # Tab for log
        self.log_tab = ttk.Frame(self.tabs)
        self.tabs.add(self.log_tab, text="Log")
        
        self.log_frame = ttk.Frame(self.log_tab)
        self.log_frame.pack(fill='both', expand=True, padx=10, pady=10)
        
        self.log_label = ttk.Label(self.log_frame, text="Operation Log:")
        self.log_label.pack(anchor='w', pady=5)
        
        self.log_text = scrolledtext.ScrolledText(self.log_frame, width=80, height=15)
        self.log_text.pack(fill='both', expand=True)
        
        # Status bar
        self.status_bar = ttk.Label(root, text="Ready", relief=tk.SUNKEN, anchor=tk.W)
        self.status_bar.pack(side=tk.BOTTOM, fill=tk.X)
        
        # Initialize variables
        self.current_url = ""
        self.current_recipe_id = ""
        self.current_recipe_title = ""
        self.scraped_enhancements = []
        self.html_content = ""
        
        # Log startup
        self.log("Application started")
        self.check_supabase_connection()

    def check_supabase_connection(self):
        """Check if Supabase connection is available"""
        if self.supabase_client:
            try:
                # Try a simple query to check connection
                self.supabase_client.table('scraped_enhancements').select('id').limit(1).execute()
                self.log("Supabase connection successful")
                self.status_bar.config(text="Connected to Supabase")
                return True
            except Exception as e:
                self.log(f"Supabase connection error: {str(e)}")
                self.status_bar.config(text="Not connected to Supabase")
                return False
        else:
            self.log("Supabase client not initialized")
            self.status_bar.config(text="Supabase not configured")
            return False
    
    def log(self, message):
        """Add a message to the log with timestamp"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] {message}"
        self.log_text.insert(tk.END, log_entry + "\n")
        self.log_text.see(tk.END)  # Scroll to the end
        print(log_entry)  # Also print to console
    
    def update_status(self, message):
        """Update the status bar"""
        self.status_bar.config(text=message)
        self.root.update_idletasks()
    
    def scrape_enhancements(self):
        """Scrape recipe enhancements from the given URL"""
        url = self.url_entry.get().strip()
        if not url:
            messagebox.showerror("Error", "Please enter a URL.")
            return
        
        recipe_id = self.recipe_id_entry.get().strip()
        recipe_title = self.recipe_title_entry.get().strip()
        
        if not recipe_id:
            messagebox.showerror("Error", "Please enter a recipe ID.")
            return
        
        if not recipe_title:
            messagebox.showerror("Error", "Please enter a recipe title.")
            return
        
        self.current_url = url
        self.current_recipe_id = recipe_id
        self.current_recipe_title = recipe_title
        
        site_type = self.site_var.get()
        
        self.log(f"Scraping enhancements from {url} for recipe {recipe_id}: {recipe_title}")
        self.update_status(f"Scraping {site_type}...")
        
        try:
            # Add random user agent to avoid being blocked
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            self.html_content = response.text
            self.html_text.delete(1.0, tk.END)
            self.html_text.insert(tk.END, self.html_content)
            
            soup = BeautifulSoup(response.content, "html.parser")
            
            # Extract enhancements based on the site type
            enhancements = self.extract_enhancements(soup, site_type)
            
            if not enhancements:
                self.log("No enhancements found. Trying generic extraction methods.")
                enhancements = self.extract_generic_enhancements(soup)
            
            if enhancements:
                self.scraped_enhancements = enhancements
                self.display_enhancements(enhancements)
                self.log(f"Successfully scraped {len(enhancements)} enhancements")
                self.update_status(f"Found {len(enhancements)} enhancements")
            else:
                self.log("No enhancements found")
                self.update_status("No enhancements found")
                messagebox.showinfo("Info", "No recipe enhancements found. Try a different URL or website type.")
        
        except requests.RequestException as e:
            error_msg = f"Network Error: {str(e)}"
            self.log(error_msg)
            self.update_status("Error: Network issue")
            messagebox.showerror("Error", error_msg)
        
        except Exception as e:
            error_msg = f"Scraping Error: {str(e)}"
            self.log(error_msg)
            self.update_status("Error: Scraping failed")
            messagebox.showerror("Error", error_msg)
    
    def extract_enhancements(self, soup, site_type):
        """Extract enhancements based on the website type"""
        enhancements = []
        
        if site_type == "allrecipes":
            # Look for tips, notes, and chef notes sections
            tip_sections = soup.select(".recipe-tips, .tips-section, .recipeNote, .recipe__tips, .recipe-note")
            for section in tip_sections:
                tips = section.find_all(['p', 'li'])
                for tip in tips:
                    text = tip.get_text(strip=True)
                    if text and len(text) > 15:  # Minimum length to be considered a tip
                        enhancements.append(text)
            
            # Look for comments with tips
            comments = soup.select(".recipe-review-body, .feedback__content, .review-content")
            for comment in comments:
                text = comment.get_text(strip=True)
                if any(keyword in text.lower() for keyword in ['tip', 'suggest', 'recommend', 'better', 'improve', 'enhance', 'try', 'substitute']):
                    if text and len(text) > 20:  # Longer minimum for comments
                        enhancements.append(text)
        
        elif site_type == "foodnetwork":
            # Food Network typically has tips in specific sections
            tip_sections = soup.select(".o-RecipeTips, .o-Notes, .recipe-tips-list, .recipe-footnotes")
            for section in tip_sections:
                tips = section.find_all(['p', 'li'])
                for tip in tips:
                    text = tip.get_text(strip=True)
                    if text and len(text) > 15:
                        enhancements.append(text)
        
        elif site_type == "epicurious":
            # Epicurious has cook's notes and community tips
            notes = soup.select(".recipe-note, .cook-notes, .tip-content, .community-tips")
            for note in notes:
                text = note.get_text(strip=True)
                if text and len(text) > 15:
                    enhancements.append(text)
        
        elif site_type == "bbcgoodfood":
            # BBC Good Food has tips and methods
            tips = soup.select(".recipe__tips, .recipe-tips, .recipe-method__item, .tip-content")
            for tip in tips:
                text = tip.get_text(strip=True)
                if text and len(text) > 15:
                    enhancements.append(text)
        
        elif site_type == "simplyrecipes":
            # Simply Recipes has tips and notes
            tips = soup.select(".recipe-note, .section--tips, .section--notes, .recipe-method__tip")
            for tip in tips:
                text = tip.get_text(strip=True)
                if text and len(text) > 15:
                    enhancements.append(text)
        
        elif site_type == "seriouseats":
            # Serious Eats has notes and tips
            tips = soup.select(".recipe-note, .recipe-notes, .recipe-tips, .note-block, .note-text")
            for tip in tips:
                text = tip.get_text(strip=True)
                if text and len(text) > 15:
                    enhancements.append(text)
        
        # Process and clean up the enhancements
        return self.process_enhancements(enhancements)
    
    def extract_generic_enhancements(self, soup):
        """Generic extraction for any website"""
        enhancements = []
        
        # Look for common tip keywords in paragraphs
        tip_keywords = ['tip', 'hint', 'note', 'suggestion', 'recommend', 'try', 'substitute', 'alternative', 'variation', 'improve']
        
        # Search in paragraphs
        paragraphs = soup.find_all('p')
        for p in paragraphs:
            text = p.get_text(strip=True)
            if any(keyword in text.lower() for keyword in tip_keywords) and len(text) > 20:
                enhancements.append(text)
        
        # Search in list items
        list_items = soup.find_all('li')
        for li in list_items:
            text = li.get_text(strip=True)
            if any(keyword in text.lower() for keyword in tip_keywords) and len(text) > 15:
                enhancements.append(text)
        
        # Look for sections that might contain tips
        potential_tip_sections = soup.select('div[class*=tip], div[class*=note], div[class*=hint], section[class*=tip], section[class*=note]')
        for section in potential_tip_sections:
            text = section.get_text(strip=True)
            if text and len(text) > 20:
                enhancements.append(text)
        
        # Process and clean up the enhancements
        return self.process_enhancements(enhancements)
    
    def process_enhancements(self, enhancements):
        """Process and clean up the enhancement texts"""
        processed = []
        seen = set()  # To avoid duplicates
        
        for text in enhancements:
            # Clean up the text
            text = re.sub(r'\s+', ' ', text)  # Replace multiple spaces with a single space
            text = text.strip()
            
            # Skip if too short or already seen
            if len(text) < 15 or text.lower() in seen:
                continue
            
            # Add to processed list and mark as seen
            processed.append(text)
            seen.add(text.lower())
        
        return processed
    
    def display_enhancements(self, enhancements):
        """Display the enhancements in the text area"""
        self.enhancements_text.delete(1.0, tk.END)
        
        if not enhancements:
            self.enhancements_text.insert(tk.END, "No enhancements found.")
            return
        
        for i, enhancement in enumerate(enhancements, 1):
            self.enhancements_text.insert(tk.END, f"{i}. {enhancement}\n\n")
    
    def save_to_database(self):
        """Save the scraped enhancements to the Supabase database"""
        if not self.scraped_enhancements:
            messagebox.showerror("Error", "No enhancements to save.")
            return
        
        if not self.supabase_client:
            messagebox.showerror("Error", "Supabase client not initialized. Check your environment variables.")
            return
        
        try:
            recipe_id = int(self.current_recipe_id)
            
            # Prepare the data
            data = {
                'recipe_id': str(recipe_id),
                'enhancements': self.scraped_enhancements,
                'source': self.current_url
            }
            
            # Insert or update the record
            self.log(f"Saving enhancements to database for recipe ID: {recipe_id}")
            result = self.supabase_client.table('scraped_enhancements').upsert(data).execute()
            
            if result.data:
                self.log(f"Successfully saved to database: {len(self.scraped_enhancements)} enhancements")
                messagebox.showinfo("Success", f"Saved {len(self.scraped_enhancements)} enhancements to database.")
            else:
                self.log("Database operation completed but no data returned")
                messagebox.showinfo("Info", "Database operation completed.")
        
        except ValueError:
            messagebox.showerror("Error", "Recipe ID must be a number.")
        
        except Exception as e:
            error_msg = f"Database Error: {str(e)}"
            self.log(error_msg)
            messagebox.showerror("Error", error_msg)
    
    def save_to_file(self):
        """Save the scraped enhancements to a JSON file"""
        if not self.scraped_enhancements:
            messagebox.showerror("Error", "No enhancements to save.")
            return
        
        try:
            # Ask for the file location
            file_path = filedialog.asksaveasfilename(
                defaultextension=".json",
                filetypes=[("JSON files", "*.json"), ("All files", "*.*")],
                initialfile=f"{self.current_recipe_title.replace(' ', '_').lower()}_enhancements.json"
            )
            
            if not file_path:
                return  # User cancelled
            
            # Prepare the data
            data = {
                'recipe_id': self.current_recipe_id,
                'recipe_title': self.current_recipe_title,
                'source_url': self.current_url,
                'enhancements': self.scraped_enhancements,
                'scraped_at': datetime.now().isoformat()
            }
            
            # Write to file
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            self.log(f"Saved enhancements to file: {file_path}")
            messagebox.showinfo("Success", f"Saved enhancements to {file_path}")
        
        except Exception as e:
            error_msg = f"File Error: {str(e)}"
            self.log(error_msg)
            messagebox.showerror("Error", error_msg)

    def batch_scrape(self):
        """Batch scrape enhancements from a list of URLs in a JSON file"""
        try:
            # Ask for the input file
            file_path = filedialog.askopenfilename(
                filetypes=[("JSON files", "*.json"), ("All files", "*.*")],
                title="Select a JSON file with recipe URLs"
            )
            
            if not file_path:
                return  # User cancelled
            
            # Load the file
            with open(file_path, 'r', encoding='utf-8') as f:
                recipes = json.load(f)
            
            if not isinstance(recipes, list):
                messagebox.showerror("Error", "The JSON file must contain a list of recipe objects.")
                return
            
            # Check if the file has the expected format
            if not all(isinstance(r, dict) and 'id' in r and 'title' in r and 'url' in r for r in recipes):
                messagebox.showerror("Error", "Each recipe must have 'id', 'title', and 'url' fields.")
                return
            
            # Ask for confirmation
            if not messagebox.askyesno("Confirm", f"Ready to scrape {len(recipes)} recipes. This may take a while. Continue?"):
                return
            
            # Create a results directory if it doesn't exist
            results_dir = os.path.join(os.path.dirname(file_path), "scraped_enhancements")
            os.makedirs(results_dir, exist_ok=True)
            
            # Prepare results log
            results_log = {
                'total': len(recipes),
                'successful': 0,
                'failed': 0,
                'recipes': []
            }
            
            # Process each recipe
            for i, recipe in enumerate(recipes, 1):
                self.log(f"Processing recipe {i}/{len(recipes)}: {recipe['title']}")
                self.update_status(f"Scraping {i}/{len(recipes)}")
                
                try:
                    # Update the UI
                    self.recipe_id_entry.delete(0, tk.END)
                    self.recipe_id_entry.insert(0, recipe['id'])
                    
                    self.recipe_title_entry.delete(0, tk.END)
                    self.recipe_title_entry.insert(0, recipe['title'])
                    
                    self.url_entry.delete(0, tk.END)
                    self.url_entry.insert(0, recipe['url'])
                    
                    # Detect the site type from the URL
                    url = recipe['url'].lower()
                    site_type = "other"
                    for s in self.sites:
                        if s in url:
                            site_type = s
                            break
                    
                    self.site_var.set(site_type)
                    self.root.update_idletasks()
                    
                    # Scrape the enhancements
                    headers = {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
                    }
                    
                    response = requests.get(recipe['url'], headers=headers, timeout=15)
                    response.raise_for_status()
                    
                    soup = BeautifulSoup(response.content, "html.parser")
                    
                    # Extract enhancements
                    enhancements = self.extract_enhancements(soup, site_type)
                    if not enhancements:
                        enhancements = self.extract_generic_enhancements(soup)
                    
                    # Save the results
                    result = {
                        'recipe_id': recipe['id'],
                        'recipe_title': recipe['title'],
                        'url': recipe['url'],
                        'site_type': site_type,
                        'enhancements': enhancements,
                        'enhancement_count': len(enhancements),
                        'scraped_at': datetime.now().isoformat()
                    }
                    
                    # Save to file
                    result_file = os.path.join(results_dir, f"{recipe['id']}_enhancements.json")
                    with open(result_file, 'w', encoding='utf-8') as f:
                        json.dump(result, f, indent=2, ensure_ascii=False)
                    
                    # Save to database if connected
                    if self.supabase_client:
                        db_data = {
                            'recipe_id': str(recipe['id']),
                            'enhancements': enhancements,
                            'source': recipe['url']
                        }
                        self.supabase_client.table('scraped_enhancements').upsert(db_data).execute()
                    
                    # Update the log
                    results_log['successful'] += 1
                    results_log['recipes'].append({
                        'id': recipe['id'],
                        'title': recipe['title'],
                        'status': 'success',
                        'enhancement_count': len(enhancements)
                    })
                    
                    # Display the current enhancements
                    self.scraped_enhancements = enhancements
                    self.display_enhancements(enhancements)
                    
                    # Add a small delay to avoid being blocked
                    time.sleep(random.uniform(1.5, 3.0))
                    
                except Exception as e:
                    error_msg = str(e)
                    self.log(f"Error processing recipe {recipe['id']}: {error_msg}")
                    
                    # Update the log
                    results_log['failed'] += 1
                    results_log['recipes'].append({
                        'id': recipe['id'],
                        'title': recipe['title'],
                        'status': 'failed',
                        'error': error_msg
                    })
                    
                    # Continue with the next recipe
                    continue
            
            # Save the results log
            log_file = os.path.join(results_dir, "batch_scrape_log.json")
            with open(log_file, 'w', encoding='utf-8') as f:
                json.dump(results_log, f, indent=2, ensure_ascii=False)
            
            # Show completion message
            self.log(f"Batch scraping completed: {results_log['successful']} successful, {results_log['failed']} failed")
            self.update_status("Batch scraping completed")
            messagebox.showinfo("Batch Scraping Complete", 
                               f"Processed {len(recipes)} recipes\n" +
                               f"Successful: {results_log['successful']}\n" +
                               f"Failed: {results_log['failed']}\n\n" +
                               f"Results saved to {results_dir}")
            
        except Exception as e:
            error_msg = f"Batch Scraping Error: {str(e)}"
            self.log(error_msg)
            messagebox.showerror("Error", error_msg)
    
    def clear_results(self):
        """Clear all result fields"""
        self.enhancements_text.delete(1.0, tk.END)
        self.html_text.delete(1.0, tk.END)
        self.scraped_enhancements = []
        self.html_content = ""
        self.update_status("Ready")
        self.log("Results cleared")
    
    def clean_enhancements(self):
        """Clean and format scraped enhancements into concise points"""
        if not self.scraped_enhancements:
            messagebox.showerror("Error", "No enhancements to clean. Please scrape a recipe first.")
            return
        
        self.log("Cleaning and formatting enhancements...")
        self.update_status("Cleaning enhancements...")
        
        # Keywords to identify important tips and enhancements
        important_keywords = [
            'tip', 'recommend', 'suggest', 'better', 'best', 'improve', 'enhance', 
            'important', 'key', 'essential', 'critical', 'crucial', 'vital', 
            'don\'t', 'avoid', 'never', 'always', 'ensure', 'make sure', 
            'temperature', 'heat', 'cook', 'bake', 'fry', 'roast', 'grill', 'simmer', 'boil',
            'substitute', 'replace', 'alternative', 'instead', 
            'secret', 'trick', 'technique', 'method'
        ]
        
        cooking_terms = [
            'cook', 'bake', 'fry', 'roast', 'grill', 'simmer', 'boil', 'steam', 'sauté', 
            'broil', 'poach', 'blanch', 'braise', 'stew', 'toast', 'whip', 'beat', 'fold', 
            'mix', 'stir', 'blend', 'chop', 'dice', 'mince', 'slice', 'julienne', 'grate', 
            'peel', 'core', 'seed', 'marinate', 'season', 'spice', 'flavor', 'taste', 
            'texture', 'consistency', 'temperature', 'heat', 'cool', 'chill', 'freeze', 
            'thaw', 'rest', 'rise', 'proof', 'ferment', 'cure', 'smoke', 'dry', 'dehydrate'
        ]
        
        # Extract potential enhancement points from the raw scraped text
        potential_points = []
        for text in self.scraped_enhancements:
            # Skip very short texts or those that are clearly not tips
            if len(text) < 15 or text.startswith('Your Private Notes') or text.startswith('Click here'):
                continue
                
            # Split text into sentences
            sentences = re.split(r'(?<=[.!?])\s+', text)
            
            for sentence in sentences:
                sentence = sentence.strip()
                if len(sentence) < 15:
                    continue
                    
                # Check if the sentence contains important keywords or cooking terms
                if any(keyword in sentence.lower() for keyword in important_keywords) or \
                   any(term in sentence.lower() for term in cooking_terms):
                    # Clean the sentence
                    clean_sentence = re.sub(r'\s+', ' ', sentence)  # Replace multiple spaces
                    clean_sentence = re.sub(r'[\(\[].*?[\)\]]', '', clean_sentence)  # Remove parentheses content
                    clean_sentence = re.sub(r'\b(?:I|we|you)\s+(?:can|should|could|might|may)\b', '', clean_sentence, flags=re.IGNORECASE)  # Remove weak modals
                    
                    # Format as a tip if it's not already
                    if not clean_sentence.endswith(('.', '!', '?')):
                        clean_sentence += '.'
                        
                    # Add to potential points if not too short after cleaning
                    if len(clean_sentence) >= 15:
                        potential_points.append(clean_sentence)
        
        # Remove duplicates and near-duplicates
        cleaned_points = []
        seen_content = set()
        
        for point in potential_points:
            # Create a simplified version for duplicate checking
            simple_point = re.sub(r'[^\w\s]', '', point.lower())
            simple_point = re.sub(r'\s+', ' ', simple_point).strip()
            
            # Check if we've seen this or a very similar point
            is_duplicate = False
            for seen in seen_content:
                # If 80% of words match, consider it a duplicate
                if self.similarity_score(simple_point, seen) > 0.8:
                    is_duplicate = True
                    break
                    
            if not is_duplicate:
                cleaned_points.append(point)
                seen_content.add(simple_point)
        
        # Sort points by relevance (length can be a simple proxy for information content)
        cleaned_points.sort(key=len, reverse=True)
        
        # Limit to the most relevant points (max 15)
        if len(cleaned_points) > 15:
            cleaned_points = cleaned_points[:15]
        
        # Update the enhancements
        self.scraped_enhancements = cleaned_points
        self.display_enhancements(cleaned_points)
        
        self.log(f"Successfully cleaned and formatted {len(cleaned_points)} enhancement points")
        self.update_status("Enhancements cleaned")
        messagebox.showinfo("Success", f"Cleaned {len(cleaned_points)} enhancement points")
    
    def clean_with_deepseek(self):
        """Use DeepSeek AI to clean and format the scraped enhancements"""
        if not self.scraped_enhancements:
            messagebox.showerror("Error", "No enhancements to clean. Please scrape a recipe first.")
            return
        
        if not deepseek_api_key:
            messagebox.showerror("Error", "DeepSeek API key not found. Please add NEXT_PUBLIC_DEEPSEEK_API_KEY to your .env file.")
            return
        
        self.log("Cleaning enhancements with DeepSeek AI...")
        self.update_status("Processing with DeepSeek AI...")
        
        # Start a thread to handle the API call without freezing the UI
        threading.Thread(target=self._process_with_deepseek, daemon=True).start()
    
    def _process_with_deepseek(self):
        """Process enhancements with DeepSeek API in a background thread"""
        try:
            # Prepare the raw text of all enhancements
            raw_text = "\n\n".join(self.scraped_enhancements)
            
            # Create the messages for DeepSeek API
            messages = [
                {
                    "role": "system",
                    "content": "You are a content formatter for recipe tips. Your ONLY task is to clean and organize the existing scraped recipe tips without adding ANY new information or your own ideas. DO NOT generate new tips or enhance the content with your own knowledge. ONLY reformat and clean what is explicitly present in the input text. Remove duplicates, personal comments, and irrelevant information. Format each point as a clear, concise statement."
                },
                {
                    "role": "user",
                    "content": f"Here are scraped recipe enhancements for {self.current_recipe_title}. Please ONLY clean and format the EXISTING content into clear, concise points. DO NOT add any new tips or information that isn't explicitly stated in the original text. Just organize what's already there:\n\n{raw_text}"
                }
            ]
            
            # Make the API call
            response = requests.post(
                deepseek_api_url,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {deepseek_api_key}"
                },
                json={
                    "model": "deepseek-chat",
                    "messages": messages,
                    "max_tokens": 1000,
                    "temperature": 0.3  # Lower temperature for more focused results
                },
                timeout=30
            )
            
            # Process the response
            if response.status_code != 200:
                error_message = f"DeepSeek API error: {response.status_code} - {response.text}"
                self.log(error_message)
                messagebox.showerror("API Error", error_message)
                return
            
            data = response.json()
            cleaned_text = data["choices"][0]["message"]["content"]
            
            # Extract the points from the AI response
            cleaned_points = []
            for line in cleaned_text.split("\n"):
                line = line.strip()
                # Skip empty lines and headers
                if not line or line.startswith("#") or line.startswith("Here"):
                    continue
                    
                # Clean up numbering and bullet points
                clean_line = re.sub(r'^[\d\-\.\*•]+\s*', '', line).strip()
                
                if clean_line and len(clean_line) > 10:
                    # Make sure each point ends with a period
                    if not clean_line.endswith(('.', '!', '?')):
                        clean_line += '.'
                    cleaned_points.append(clean_line)
            
            # Update the UI in the main thread
            self.root.after(0, self._update_ui_with_deepseek_results, cleaned_points)
            
        except Exception as e:
            error_message = f"Error processing with DeepSeek: {str(e)}"
            self.log(error_message)
            self.root.after(0, lambda: messagebox.showerror("Error", error_message))
    
    def _update_ui_with_deepseek_results(self, cleaned_points):
        """Update the UI with the results from DeepSeek"""
        if not cleaned_points:
            messagebox.showinfo("Info", "DeepSeek AI couldn't extract any clear enhancement points. Try the regular clean function instead.")
            return
            
        # Update the enhancements
        self.scraped_enhancements = cleaned_points
        self.display_enhancements(cleaned_points)
        
        self.log(f"Successfully cleaned {len(cleaned_points)} enhancement points with DeepSeek AI")
        self.update_status("DeepSeek AI processing complete")
        messagebox.showinfo("Success", f"DeepSeek AI extracted {len(cleaned_points)} enhancement points")
    
    def similarity_score(self, text1, text2):
        """Calculate similarity between two text strings based on word overlap"""
        words1 = set(text1.split())
        words2 = set(text2.split())
        
        if not words1 or not words2:
            return 0.0
            
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        
        return len(intersection) / len(union)
    
    def open_manual_entry(self):
        """Open a window for manual enhancement entry"""
        manual_window = tk.Toplevel(self.root)
        manual_window.title("Manual Enhancement Entry")
        manual_window.geometry("800x600")
        manual_window.configure(bg='#f5f5f5')

        # Make window modal
        manual_window.transient(self.root)
        manual_window.grab_set()

        # Recipe info frame
        info_frame = ttk.Frame(manual_window)
        info_frame.pack(fill='x', padx=20, pady=10)

        # Recipe ID
        ttk.Label(info_frame, text="Recipe ID:").grid(row=0, column=0, sticky='w', padx=5)
        recipe_id_var = tk.StringVar(value=self.recipe_id_entry.get())
        recipe_id_entry = ttk.Entry(info_frame, textvariable=recipe_id_var, width=15)
        recipe_id_entry.grid(row=0, column=1, sticky='w', padx=5)

        # Recipe Title
        ttk.Label(info_frame, text="Recipe Title:").grid(row=0, column=2, sticky='w', padx=5)
        recipe_title_var = tk.StringVar(value=self.recipe_title_entry.get())
        recipe_title_entry = ttk.Entry(info_frame, textvariable=recipe_title_var, width=40)
        recipe_title_entry.grid(row=0, column=3, sticky='w', padx=5)

        # Instructions
        instructions_frame = ttk.Frame(manual_window)
        instructions_frame.pack(fill='x', padx=20, pady=5)

        instructions_text = """Instructions:
• Enter each enhancement on a new line
• Keep enhancements concise and actionable
• Focus on cooking tips, techniques, and improvements
• Use clear, descriptive language"""

        ttk.Label(instructions_frame, text=instructions_text, justify='left').pack(anchor='w')

        # Text area for manual entry
        text_frame = ttk.Frame(manual_window)
        text_frame.pack(fill='both', expand=True, padx=20, pady=10)

        ttk.Label(text_frame, text="Enter Recipe Enhancements (one per line):").pack(anchor='w', pady=5)

        # Create text widget with scrollbar
        text_widget = scrolledtext.ScrolledText(text_frame, width=80, height=20, wrap=tk.WORD)
        text_widget.pack(fill='both', expand=True)

        # Pre-populate with existing enhancements if any
        if self.scraped_enhancements:
            for enhancement in self.scraped_enhancements:
                text_widget.insert(tk.END, f"{enhancement}\n")

        # Button frame
        button_frame = ttk.Frame(manual_window)
        button_frame.pack(fill='x', padx=20, pady=10)

        def save_manual_enhancements():
            """Save the manually entered enhancements"""
            recipe_id = recipe_id_var.get().strip()
            recipe_title = recipe_title_var.get().strip()

            if not recipe_id:
                messagebox.showerror("Error", "Please enter a recipe ID.")
                return

            if not recipe_title:
                messagebox.showerror("Error", "Please enter a recipe title.")
                return

            # Get text content and split into lines
            content = text_widget.get(1.0, tk.END).strip()
            if not content:
                messagebox.showerror("Error", "Please enter at least one enhancement.")
                return

            # Process the enhancements
            enhancements = []
            for line in content.split('\n'):
                line = line.strip()
                if line and len(line) > 5:  # Skip empty lines and very short entries
                    # Remove numbering if present
                    line = re.sub(r'^\d+\.\s*', '', line)
                    line = re.sub(r'^[\-\*•]\s*', '', line)

                    # Ensure proper punctuation
                    if not line.endswith(('.', '!', '?')):
                        line += '.'

                    enhancements.append(line)

            if not enhancements:
                messagebox.showerror("Error", "No valid enhancements found. Please check your entries.")
                return

            # Update the main application
            self.recipe_id_entry.delete(0, tk.END)
            self.recipe_id_entry.insert(0, recipe_id)

            self.recipe_title_entry.delete(0, tk.END)
            self.recipe_title_entry.insert(0, recipe_title)

            self.current_recipe_id = recipe_id
            self.current_recipe_title = recipe_title
            self.current_url = "Manual Entry"
            self.scraped_enhancements = enhancements

            # Display the enhancements
            self.display_enhancements(enhancements)

            # Log the action
            self.log(f"Manually entered {len(enhancements)} enhancements for recipe {recipe_id}: {recipe_title}")
            self.update_status(f"Manual entry: {len(enhancements)} enhancements")

            # Close the window
            manual_window.destroy()

            messagebox.showinfo("Success", f"Successfully added {len(enhancements)} manual enhancements!")

        def load_from_file():
            """Load enhancements from a text file"""
            file_path = filedialog.askopenfilename(
                filetypes=[("Text files", "*.txt"), ("All files", "*.*")],
                title="Select a text file with enhancements"
            )

            if file_path:
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()

                    text_widget.delete(1.0, tk.END)
                    text_widget.insert(1.0, content)

                    messagebox.showinfo("Success", "File loaded successfully!")

                except Exception as e:
                    messagebox.showerror("Error", f"Failed to load file: {str(e)}")

        def clear_text():
            """Clear the text area"""
            if messagebox.askyesno("Confirm", "Clear all text?"):
                text_widget.delete(1.0, tk.END)

        # Buttons
        ttk.Button(button_frame, text="Save Enhancements", command=save_manual_enhancements).pack(side='left', padx=5)
        ttk.Button(button_frame, text="Load from File", command=load_from_file).pack(side='left', padx=5)
        ttk.Button(button_frame, text="Clear", command=clear_text).pack(side='left', padx=5)
        ttk.Button(button_frame, text="Cancel", command=manual_window.destroy).pack(side='right', padx=5)

        # Focus on text widget
        text_widget.focus_set()

    def scrape_recipe(self):
        """Legacy method for backward compatibility"""
        self.scrape_enhancements()

if __name__ == "__main__":
    root = tk.Tk()
    app = RecipeScraperApp(root)
    root.mainloop()
