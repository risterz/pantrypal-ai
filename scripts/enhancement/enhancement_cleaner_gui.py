import tkinter as tk
from tkinter import ttk, scrolledtext, messagebox
import os
import json
from datetime import datetime
import supabase
from dotenv import load_dotenv

# Load environment variables - try multiple locations
env_paths = [
    '../../.env',  # Project root
    '../scrapper/.env',  # Scrapper directory
    '.env',  # Current directory
]

env_loaded = False
for env_path in env_paths:
    if os.path.exists(env_path):
        load_dotenv(env_path)
        env_loaded = True
        print(f"Loaded environment from: {env_path}")
        break

if not env_loaded:
    load_dotenv()  # Try default locations
    print("Using default environment loading")

# Initialize API keys and URLs
supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
supabase_key = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

class EnhancementCleanerApp:
    def __init__(self, root):
        self.root = root
        self.root.title("PantryPal Enhancement Cleaner Tool")
        self.root.geometry("800x600")
        self.root.configure(bg='#f5f5f5')

        # Initialize UI first
        self.setup_ui()

        # Initialize Supabase client after UI is ready
        self.supabase_client = None
        if supabase_url and supabase_key:
            try:
                self.supabase_client = supabase.create_client(supabase_url, supabase_key)
                self.log_message("✅ Supabase client initialized successfully")
                self.update_connection_status(True)
            except Exception as e:
                self.log_message(f"❌ Error initializing Supabase client: {e}")
                self.update_connection_status(False)
        else:
            self.log_message("❌ Missing Supabase environment variables")
            self.update_connection_status(False)
        
    def setup_ui(self):
        # Title
        title_label = ttk.Label(self.root, text="PantryPal Enhancement Cleaner", 
                               font=('Arial', 16, 'bold'))
        title_label.pack(pady=10)
        
        # Connection status
        status_frame = ttk.Frame(self.root)
        status_frame.pack(fill='x', padx=20, pady=5)
        
        self.status_label = ttk.Label(status_frame, text="Database Status: ", font=('Arial', 10))
        self.status_label.pack(side='left')
        
        self.status_indicator = ttk.Label(status_frame,
                                         text="Checking...",
                                         font=('Arial', 10, 'bold'),
                                         foreground="orange")
        self.status_indicator.pack(side='left')
        
        # Recipe ID input section
        input_frame = ttk.LabelFrame(self.root, text="Recipe Enhancement Management", padding=10)
        input_frame.pack(fill='x', padx=20, pady=10)
        
        # Recipe ID input
        recipe_id_frame = ttk.Frame(input_frame)
        recipe_id_frame.pack(fill='x', pady=5)
        
        ttk.Label(recipe_id_frame, text="Recipe ID:").pack(side='left', padx=5)
        self.recipe_id_entry = ttk.Entry(recipe_id_frame, width=15, font=('Arial', 12))
        self.recipe_id_entry.pack(side='left', padx=5)
        
        # Buttons frame
        buttons_frame = ttk.Frame(input_frame)
        buttons_frame.pack(fill='x', pady=10)
        
        # View enhancement button
        self.view_btn = ttk.Button(buttons_frame, text="View Enhancement", 
                                  command=self.view_enhancement, style='Info.TButton')
        self.view_btn.pack(side='left', padx=5)
        
        # Delete enhancement button
        self.delete_btn = ttk.Button(buttons_frame, text="Delete Enhancement", 
                                    command=self.delete_enhancement, style='Danger.TButton')
        self.delete_btn.pack(side='left', padx=5)
        
        # Clear all enhancements button (dangerous)
        self.clear_all_btn = ttk.Button(buttons_frame, text="Clear All Enhancements", 
                                       command=self.clear_all_enhancements, style='Danger.TButton')
        self.clear_all_btn.pack(side='left', padx=5)
        
        # Enhancement display section
        display_frame = ttk.LabelFrame(self.root, text="Enhancement Details", padding=10)
        display_frame.pack(fill='both', expand=True, padx=20, pady=10)
        
        # Enhancement text area
        self.enhancement_text = scrolledtext.ScrolledText(display_frame, height=15, width=80, 
                                                         font=('Consolas', 10), wrap=tk.WORD)
        self.enhancement_text.pack(fill='both', expand=True)
        
        # Log section
        log_frame = ttk.LabelFrame(self.root, text="Activity Log", padding=10)
        log_frame.pack(fill='x', padx=20, pady=(0, 20))
        
        self.log_text = scrolledtext.ScrolledText(log_frame, height=6, width=80, 
                                                 font=('Consolas', 9), wrap=tk.WORD)
        self.log_text.pack(fill='both', expand=True)
        
        # Configure button styles
        self.setup_styles()
        
        # Bind Enter key to recipe ID entry
        self.recipe_id_entry.bind('<Return>', lambda _: self.view_enhancement())
        
    def setup_styles(self):
        style = ttk.Style()
        style.configure('Info.TButton', foreground='blue')
        style.configure('Danger.TButton', foreground='red')

    def update_connection_status(self, connected):
        """Update the connection status indicator"""
        if connected:
            self.status_indicator.config(text="Connected ✅", foreground="green")
        else:
            self.status_indicator.config(text="Disconnected ❌", foreground="red")

    def log_message(self, message):
        """Add a message to the log with timestamp"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        log_entry = f"[{timestamp}] {message}\n"
        self.log_text.insert(tk.END, log_entry)
        self.log_text.see(tk.END)
        self.root.update()
        
    def view_enhancement(self):
        """View the current enhancement for a recipe"""
        if not self.supabase_client:
            messagebox.showerror("Error", "Database connection not available")
            return
            
        recipe_id = self.recipe_id_entry.get().strip()
        if not recipe_id:
            messagebox.showerror("Error", "Please enter a Recipe ID")
            return
            
        try:
            self.log_message(f"🔍 Fetching enhancement for Recipe ID: {recipe_id}")
            
            # Query the database for the enhancement
            response = self.supabase_client.table('recipe_enhancements').select('*').eq('recipe_id', recipe_id).execute()
            
            if not response.data:
                self.enhancement_text.delete(1.0, tk.END)
                self.enhancement_text.insert(tk.END, f"No enhancement found for Recipe ID: {recipe_id}")
                self.log_message(f"❌ No enhancement found for Recipe ID: {recipe_id}")
                return
                
            enhancement_data = response.data[0]
            
            # Display enhancement details
            self.enhancement_text.delete(1.0, tk.END)
            self.enhancement_text.insert(tk.END, f"Recipe ID: {enhancement_data['recipe_id']}\n")
            self.enhancement_text.insert(tk.END, f"Created: {enhancement_data['created_at']}\n")
            self.enhancement_text.insert(tk.END, f"Updated: {enhancement_data['updated_at']}\n")
            
            if enhancement_data.get('dietary_preferences'):
                self.enhancement_text.insert(tk.END, f"Dietary Preferences: {enhancement_data['dietary_preferences']}\n")
            
            self.enhancement_text.insert(tk.END, "\n" + "="*50 + "\n")
            self.enhancement_text.insert(tk.END, "ENHANCEMENTS:\n")
            self.enhancement_text.insert(tk.END, "="*50 + "\n\n")
            
            # Display enhancements
            enhancements = enhancement_data.get('enhancements', [])
            if enhancements:
                for i, enhancement in enumerate(enhancements, 1):
                    self.enhancement_text.insert(tk.END, f"{i}. {enhancement}\n\n")
            else:
                self.enhancement_text.insert(tk.END, "No enhancements available.\n")
                
            # Display categorized enhancements if available
            categorized = enhancement_data.get('categorized_enhancements')
            if categorized:
                self.enhancement_text.insert(tk.END, "\n" + "="*50 + "\n")
                self.enhancement_text.insert(tk.END, "CATEGORIZED ENHANCEMENTS:\n")
                self.enhancement_text.insert(tk.END, "="*50 + "\n\n")
                
                for category, items in categorized.items():
                    if items:
                        self.enhancement_text.insert(tk.END, f"{category.upper()}:\n")
                        for item in items:
                            self.enhancement_text.insert(tk.END, f"  • {item}\n")
                        self.enhancement_text.insert(tk.END, "\n")
            
            self.log_message(f"✅ Enhancement loaded successfully for Recipe ID: {recipe_id}")
            
        except Exception as e:
            self.log_message(f"❌ Error fetching enhancement: {str(e)}")
            messagebox.showerror("Error", f"Failed to fetch enhancement: {str(e)}")
            
    def delete_enhancement(self):
        """Delete the enhancement for a specific recipe"""
        if not self.supabase_client:
            messagebox.showerror("Error", "Database connection not available")
            return
            
        recipe_id = self.recipe_id_entry.get().strip()
        if not recipe_id:
            messagebox.showerror("Error", "Please enter a Recipe ID")
            return
            
        # Confirm deletion
        confirm = messagebox.askyesno("Confirm Deletion", 
                                     f"Are you sure you want to delete the enhancement for Recipe ID: {recipe_id}?\n\n"
                                     "This action cannot be undone.")
        if not confirm:
            return
            
        try:
            self.log_message(f"🗑️ Deleting enhancement for Recipe ID: {recipe_id}")
            
            # Delete the enhancement
            response = self.supabase_client.table('recipe_enhancements').delete().eq('recipe_id', recipe_id).execute()
            
            if response.data:
                self.enhancement_text.delete(1.0, tk.END)
                self.enhancement_text.insert(tk.END, f"Enhancement for Recipe ID {recipe_id} has been deleted successfully.")
                self.log_message(f"✅ Enhancement deleted successfully for Recipe ID: {recipe_id}")
                messagebox.showinfo("Success", f"Enhancement for Recipe ID {recipe_id} has been deleted.")
            else:
                self.log_message(f"❌ No enhancement found to delete for Recipe ID: {recipe_id}")
                messagebox.showwarning("Warning", f"No enhancement found for Recipe ID: {recipe_id}")
                
        except Exception as e:
            self.log_message(f"❌ Error deleting enhancement: {str(e)}")
            messagebox.showerror("Error", f"Failed to delete enhancement: {str(e)}")
            
    def clear_all_enhancements(self):
        """Clear all enhancements from the database (DANGEROUS)"""
        if not self.supabase_client:
            messagebox.showerror("Error", "Database connection not available")
            return
            
        # Double confirmation for this dangerous operation
        confirm1 = messagebox.askyesno("⚠️ DANGER - Confirm Clear All", 
                                      "⚠️ WARNING: This will delete ALL enhancements from the database!\n\n"
                                      "This action cannot be undone and will affect all recipes.\n\n"
                                      "Are you absolutely sure you want to continue?")
        if not confirm1:
            return
            
        confirm2 = messagebox.askyesno("⚠️ FINAL CONFIRMATION", 
                                      "This is your FINAL WARNING!\n\n"
                                      "You are about to delete ALL recipe enhancements.\n"
                                      "This will affect the entire PantryPal system.\n\n"
                                      "Type 'DELETE ALL' in the next dialog to confirm.")
        if not confirm2:
            return
            
        # Ask user to type confirmation
        from tkinter import simpledialog
        confirmation_text = simpledialog.askstring("Type Confirmation", 
                                                   "Type 'DELETE ALL' to confirm (case sensitive):")
        
        if confirmation_text != "DELETE ALL":
            messagebox.showinfo("Cancelled", "Operation cancelled. Confirmation text did not match.")
            return
            
        try:
            self.log_message("🗑️ CLEARING ALL ENHANCEMENTS - This may take a moment...")
            
            # Delete all enhancements
            self.supabase_client.table('recipe_enhancements').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
            
            self.enhancement_text.delete(1.0, tk.END)
            self.enhancement_text.insert(tk.END, "ALL ENHANCEMENTS HAVE BEEN CLEARED FROM THE DATABASE.\n\n")
            self.enhancement_text.insert(tk.END, "Enhancements will be regenerated when users visit recipe pages.")
            
            self.log_message("✅ ALL ENHANCEMENTS CLEARED SUCCESSFULLY")
            messagebox.showinfo("Success", "All enhancements have been cleared from the database.")
            
        except Exception as e:
            self.log_message(f"❌ Error clearing all enhancements: {str(e)}")
            messagebox.showerror("Error", f"Failed to clear all enhancements: {str(e)}")

def main():
    root = tk.Tk()
    EnhancementCleanerApp(root)
    root.mainloop()

if __name__ == "__main__":
    main()
