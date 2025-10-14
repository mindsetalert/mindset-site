import requests
import uuid
import platform
import json
import os
from datetime import datetime

class LicenseValidator:
    def __init__(self, api_base_url="https://mindset-site.vercel.app"):
        self.api_base_url = api_base_url
        self.machine_id = self._get_machine_id()
        self.machine_name = f"{platform.node()} ({platform.system()})"
        self.license_file = os.path.join(os.path.expanduser("~"), ".mindset_license")
    
    def _get_machine_id(self):
        """Génère un ID unique pour cette machine"""
        try:
            # Essayer de lire un ID existant
            if os.path.exists(os.path.join(os.path.expanduser("~"), ".mindset_machine_id")):
                with open(os.path.join(os.path.expanduser("~"), ".mindset_machine_id"), "r") as f:
                    return f.read().strip()
        except:
            pass
        
        # Générer un nouvel ID
        machine_id = str(uuid.uuid4())
        try:
            with open(os.path.join(os.path.expanduser("~"), ".mindset_machine_id"), "w") as f:
                f.write(machine_id)
        except:
            pass
        
        return machine_id
    
    def validate_license(self, license_key):
        """Valide une clé de licence"""
        try:
            response = requests.post(
                f"{self.api_base_url}/api/validate-license",
                json={
                    "licenseKey": license_key,
                    "machineId": self.machine_id,
                    "machineName": self.machine_name
                },
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("valid"):
                    # Sauvegarder la licence localement
                    self._save_license(license_key, data["license"])
                    return True, "Licence valide"
                else:
                    return False, "Licence invalide"
            else:
                error_data = response.json()
                return False, error_data.get("error", "Erreur de validation")
                
        except requests.exceptions.RequestException as e:
            return False, f"Erreur de connexion: {str(e)}"
        except Exception as e:
            return False, f"Erreur inattendue: {str(e)}"
    
    def _save_license(self, license_key, license_data):
        """Sauvegarde la licence localement"""
        try:
            license_info = {
                "license_key": license_key,
                "machine_id": self.machine_id,
                "validated_at": datetime.now().isoformat(),
                "license_data": license_data
            }
            with open(self.license_file, "w") as f:
                json.dump(license_info, f)
        except Exception as e:
            print(f"Erreur sauvegarde licence: {e}")
    
    def load_saved_license(self):
        """Charge la licence sauvegardée"""
        try:
            if os.path.exists(self.license_file):
                with open(self.license_file, "r") as f:
                    return json.load(f)
        except Exception as e:
            print(f"Erreur chargement licence: {e}")
        return None
    
    def deactivate_license(self, license_key):
        """Désactive la licence"""
        try:
            response = requests.post(
                f"{self.api_base_url}/api/deactivate-license",
                json={
                    "licenseKey": license_key,
                    "machineId": self.machine_id
                },
                timeout=10
            )
            
            if response.status_code == 200:
                # Supprimer le fichier de licence local
                if os.path.exists(self.license_file):
                    os.remove(self.license_file)
                return True, "Licence désactivée"
            else:
                error_data = response.json()
                return False, error_data.get("error", "Erreur de désactivation")
                
        except requests.exceptions.RequestException as e:
            return False, f"Erreur de connexion: {str(e)}"
        except Exception as e:
            return False, f"Erreur inattendue: {str(e)}"

def check_license():
    """Fonction principale pour vérifier la licence"""
    validator = LicenseValidator()
    
    # Charger la licence sauvegardée
    saved_license = validator.load_saved_license()
    
    if saved_license:
        # Valider la licence sauvegardée
        valid, message = validator.validate_license(saved_license["license_key"])
        if valid:
            return True, "Licence valide"
        else:
            print(f"Licence sauvegardée invalide: {message}")
    
    # Demander une nouvelle licence
    print("=== VALIDATION DE LICENCE MINDSET TRADING ===")
    print("Veuillez entrer votre clé de licence:")
    license_key = input("Clé de licence: ").strip()
    
    if not license_key:
        return False, "Aucune clé de licence fournie"
    
    valid, message = validator.validate_license(license_key)
    return valid, message

if __name__ == "__main__":
    valid, message = check_license()
    if valid:
        print(f"✅ {message}")
        print("L'application peut démarrer.")
    else:
        print(f"❌ {message}")
        print("L'application ne peut pas démarrer sans licence valide.")
        input("Appuyez sur Entrée pour quitter...")
        exit(1)




